from typing import List
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Send

from .state import AgentState
from .config import settings
from .scoring import rank_evaluated_hooks
from .nodes import (
    ideate_node,
    critique_node,
    revise_node,
    compliance_node,
    rank_node,
    human_select_node,
    write_script_node,
    media_plan_node,
    generate_visuals_node,
    package_node,
)


def quality_gate(state: AgentState) -> str:
    """Evaluates whether the candidate hooks satisfy quality threshold or require revision."""
    hooks = state.get("hooks", [])
    evaluations = state.get("evaluations", [])
    rev_count = state.get("revision_count", 0)

    ranked = rank_evaluated_hooks(hooks, evaluations, [])
    top_3 = ranked[:3]
    mean_top = (
        sum(h["compositeScore"] for h in top_3) / len(top_3)
        if top_3
        else 0.0
    )

    if mean_top < settings.QUALITY_THRESHOLD and rev_count < settings.MAX_REVISIONS:
        return "revise"
    return "compliance"


def fan_out_scripts(state: AgentState) -> List[Send]:
    """Parallel fan-out: sends one execution branch per selected hook to write_script."""
    selected_ids = state.get("selected_hook_ids", [])
    ranked_map = {h["id"]: h["text"] for h in state.get("ranked_hooks", [])}
    hooks_map = {h["id"]: h["text"] for h in state.get("hooks", [])}

    sends: List[Send] = []
    for h_id in selected_ids:
        text = ranked_map.get(h_id, hooks_map.get(h_id, "Winning hook"))
        sends.append(
            Send(
                "write_script",
                {
                    "hook_id": h_id,
                    "hook_text": text,
                    "audience": state.get("audience", "Job seekers"),
                    "language": state.get("language", "Hinglish"),
                    "platform": state.get("platform", "Instagram Reel"),
                    "tone": state.get("tone", "Relatable"),
                },
            )
        )

    if not sends:
        default_id = state.get("ranked_hooks", [{}])[0].get("id", "hook_1")
        default_text = state.get("ranked_hooks", [{}])[0].get("text", "Top hook")
        sends.append(
            Send(
                "write_script",
                {
                    "hook_id": default_id,
                    "hook_text": default_text,
                    "audience": state.get("audience", "Job seekers"),
                    "language": state.get("language", "Hinglish"),
                    "platform": state.get("platform", "Instagram Reel"),
                    "tone": state.get("tone", "Relatable"),
                },
            )
        )

    return sends


def visuals_check(state: AgentState) -> str:
    """Conditional edge checking whether image generation was requested."""
    if state.get("generate_images"):
        return "generate_visuals"
    return "package"


def create_growth_graph(checkpointer: MemorySaver = None):
    """Builds and compiles the Growth Lab LangGraph state machine."""
    workflow = StateGraph(AgentState)

    # Add Nodes
    workflow.add_node("ideate", ideate_node)
    workflow.add_node("critique", critique_node)
    workflow.add_node("revise", revise_node)
    workflow.add_node("compliance", compliance_node)
    workflow.add_node("rank", rank_node)
    workflow.add_node("human_select", human_select_node)
    workflow.add_node("write_script", write_script_node)
    workflow.add_node("media_plan", media_plan_node)
    workflow.add_node("generate_visuals", generate_visuals_node)
    workflow.add_node("package", package_node)

    # Standard Edges
    workflow.add_edge(START, "ideate")
    workflow.add_edge("ideate", "critique")

    # Quality Gate (Conditional edge for self-healing revision loop)
    workflow.add_conditional_edges(
        "critique",
        quality_gate,
        {
            "revise": "revise",
            "compliance": "compliance",
        },
    )
    workflow.add_edge("revise", "critique")

    # Compliance to Ranking to Human Select
    workflow.add_edge("compliance", "rank")
    workflow.add_edge("rank", "human_select")

    # Parallel Fan-Out: human_select -> write_script
    workflow.add_conditional_edges("human_select", fan_out_scripts, ["write_script"])

    # Aggregation & Media Plan
    workflow.add_edge("write_script", "media_plan")

    # Conditional Visuals Edge
    workflow.add_conditional_edges(
        "media_plan",
        visuals_check,
        {
            "generate_visuals": "generate_visuals",
            "package": "package",
        },
    )
    workflow.add_edge("generate_visuals", "package")
    workflow.add_edge("package", END)

    cp = checkpointer or MemorySaver()
    return workflow.compile(checkpointer=cp)


# Precompiled default instance
default_checkpointer = MemorySaver()
growth_graph = create_growth_graph(default_checkpointer)
