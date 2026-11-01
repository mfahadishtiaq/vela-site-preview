---
title: "From asking to delegating: what agentic workflows give back"
slug: from-asking-to-delegating
image: from-asking-to-delegating.jpg
date: 2026-05-20
cover: Delegate
author: Fahad Ishtiaq
summary: "AI agents can carry work across several steps. Measure the time they give back after supervision, correction and maintenance."
status: published
---
Delegating a task should release time. With AI, that assumption needs testing.

In an early-2025 randomised trial, sixteen experienced open-source developers took 19% longer to complete tasks when AI tools were allowed. They nevertheless believed the tools had made them faster (Becker et al., 2025). METR’s subsequent experiment encountered selection and measurement problems, including developers’ reluctance to work without AI, making its newer results an unreliable estimate of the current effect (Becker et al., 2026).

Delegation earns its value in the work it takes off your hands. Agents can carry out more of a process. The business case begins when the time saved exceeds the effort of keeping that process on track.

## What changes when software can act

A conversational assistant can help draft an answer. A rule-based automation can move a form submission into a spreadsheet. An agent can be given a goal and choose steps and tools in response to what it encounters.

These categories overlap in products. The useful distinction concerns who determines the sequence of work. Anthropic distinguishes predefined workflows from agents that direct their own processes, recommending the simplest design that meets the need (Schluntz & Zhang, 2024). ReAct supplies an influential research example of models combining reasoning, actions and observations (Yao et al., 2023).

An agent might search for information, inspect a result and choose its next action. That flexibility is valuable when the correct next step varies. It also creates more opportunities for a mistake to affect later steps.

Consider a hypothetical enquiry workflow. Software receives a message, retrieves approved service information, checks availability and prepares a reply. A defined process may handle an ordinary booking; an unusual request goes to a person. The business needs that enquiry to reach a useful next step. The label on the software matters less than whether the work gets done.

## A practical map of the tools

Start with where the work happens. These seven groups show the main ways to connect AI to a task.

**Automation platforms.** Tools such as Zapier, Make and n8n connect applications and can place AI within a repeatable process. Zapier advertises connections across more than 9,000 applications (Zapier, n.d.-a). They suit repeatable work that moves information between connected systems.

**Browser and computer assistants.** Examples include ChatGPT agent (Zeff, 2025), Gemini Agent (Google, 2025) and systems built with Anthropic’s computer-use tool (Anthropic, 2026a). They can interact with interfaces as part of a task. Test them on the sites and accounts the work actually uses.

**Coding agents.** Claude Code can inspect a codebase, edit files and run development tools (Anthropic, 2026b). A proposed change still needs appropriate review and testing in its intended environment.

**Agents inside business software.** Microsoft Copilot Studio provides tools for building agents and workflows (Microsoft, 2026). Salesforce’s Agentforce 360, ServiceNow’s announced AI specialists and Gemini Enterprise place related capabilities within enterprise environments (Kurian, 2025; Salesforce, 2025; ServiceNow, 2026). UiPath’s agentic-automation platform combines agents, software robots and people (UiPath, 2025). Existing software can provide a useful starting point when the required records and permissions already sit there.

**Voice agents.** ElevenLabs documents conversational voice systems and integrations for carrying out tasks (ElevenLabs, 2026). A phone interaction may be one part of a booking or support process, with escalation designed for requests the system cannot handle.

**Developer frameworks.** LangGraph, CrewAI and the OpenAI Agents SDK provide building blocks for custom systems, including mechanisms for orchestration, state or tracing (CrewAI, 2026; LangChain, 2026; OpenAI, 2026). They give developers control over how a custom workflow runs and how its activity is recorded.

**The connecting standards.** Protocols form a separate layer. Anthropic introduced the Model Context Protocol to connect assistants with tools and data, then donated it to the Agentic AI Foundation in December 2025 (Anthropic, 2024a, 2025). The Linux Foundation’s Agent2Agent project supports communication between agents (Linux Foundation, 2026). They help systems communicate across organisational and software boundaries.

## What improving benchmarks tell us

Capabilities are advancing quickly. Anthropic introduced computer use, an AI model operating a computer much as a person does, in October 2024 (Anthropic, 2024b). The 2026 AI Index from Stanford’s Institute for Human-Centered Artificial Intelligence (Stanford HAI) reports that agents went from 12% to about 66% task success on OSWorld, a benchmark of real computer tasks, against a human baseline of about 72%. They still fail roughly one attempt in three (Stanford HAI, 2026).

Software benchmarks also track progress. SWE-bench uses tasks drawn from real GitHub issues (Jimenez et al., 2024). Results on different versions of a benchmark should not be treated as a single directly comparable series.

METR’s March 2025 analysis found that the human-duration equivalent of software tasks agents could complete at 50% reliability had historically doubled roughly every seven months (Kwa et al., 2025). The measure covers software tasks at 50% reliability. A business process needs a much stronger record before it can run with little supervision.

Benchmarks help assess capability. A business trial must also capture information access, interruptions, unusual cases, correction and the consequences of failure.

## Decide where a person intervenes

Approval should be designed around the action and its consequences. Preparing a draft, sending it, changing a customer record and making a payment involve different responsibilities.

Several tools provide mechanisms for intervention. Zapier and n8n document ways to pause work for human review (n8n, 2026; Zapier, n.d.-b). LangGraph supports interrupts that wait for external input (LangChain, 2026). Google describes Gemini Agent as seeking confirmation before critical actions such as purchases or sending messages (Google, 2025).

A configurable control is useful when someone has defined what it must protect and when a reviewer can make an informed decision. Permission behaviour also varies by product, settings and deployment. It should be checked rather than assumed from the word “agent.”

Security extends beyond approval screens. Anthropic warns that computer-use systems can encounter malicious instructions embedded in content they read (Anthropic, 2026a). A business should limit access to what a task requires, keep an intelligible activity record and test how the process handles untrusted material.

## Count the time that actually returns

Workplace research offers useful reference points for measuring time returned.

In November 2024 US survey data, AI users reported savings averaging 5.4% of work hours, approximately 2.2 hours in a 40-hour week. Including non-users reduced that estimate to 1.4% of total hours (Bick et al., 2025). A customer-support field study found a 15% average improvement in issues resolved per hour (Brynjolfsson et al., 2025).

A randomised experiment across 66 firms found that treated workers who used an integrated generative-AI tool spent about two fewer hours per week on email in the experiment’s second half. Researchers did not detect changes in task quantity or composition (Dillon et al., 2025). Danish research likewise found task reorganisation without detectable average effects on earnings or recorded hours (Humlum & Vestergaard, 2026).

Implementation deserves the same attention as capability. Gartner forecasts that more than 40% of agentic-AI projects will be cancelled by the end of 2027 (Gartner, 2025).

For a first trial, record the current completion time and quality for a defined workflow. Separate one-off setup from recurring supervision and maintenance, then count failed runs and correction as well as successful execution. Decide which actions require approval and which exceptions return to a person.

A useful agent takes a job far enough that someone can stop carrying it in their head. Count the checking and correction, then look at what time remains. If that time goes into better service, more capacity or a shorter working day, delegation has earned its place.

## References

- Anthropic. (2024a, November 25). *Introducing the Model Context Protocol*. [https://www.anthropic.com/news/model-context-protocol](https://www.anthropic.com/news/model-context-protocol)
- Anthropic. (2024b, October 22). *Introducing computer use, a new Claude 3.5 Sonnet, and Claude 3.5 Haiku*. [https://www.anthropic.com/news/3-5-models-and-computer-use](https://www.anthropic.com/news/3-5-models-and-computer-use)
- Anthropic. (2025, December 9). *Donating the Model Context Protocol and establishing the Agentic AI Foundation*. [https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation)
- Anthropic. (2026a). *Computer use tool* [Documentation]. [https://platform.claude.com/docs/en/docs/agents-and-tools/tool-use/computer-use-tool](https://platform.claude.com/docs/en/docs/agents-and-tools/tool-use/computer-use-tool)
- Anthropic. (2026b). *Claude Code overview* [Documentation]. [https://code.claude.com/docs/en/overview](https://code.claude.com/docs/en/overview)
- Becker, J., Rush, N., Barnes, B., & Rein, D. (2025, July 10). *Measuring the impact of early-2025 AI on experienced open-source developer productivity*. METR. [https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)
- Becker, J., Rush, N., Cunningham, T., Rein, D., & Mahamud, K. (2026, February 24). *We are changing our developer productivity experiment design*. METR. [https://metr.org/blog/2026-02-24-uplift-update/](https://metr.org/blog/2026-02-24-uplift-update/)
- Bick, A., Blandin, A., & Deming, D. (2025, February 27). *The impact of generative AI on work productivity*. Federal Reserve Bank of St. Louis. [https://www.stlouisfed.org/on-the-economy/2025/feb/impact-generative-ai-work-productivity](https://www.stlouisfed.org/on-the-economy/2025/feb/impact-generative-ai-work-productivity)
- Brynjolfsson, E., Li, D., & Raymond, L. (2025). Generative AI at work. *The Quarterly Journal of Economics, 140*(2), 889–942. [https://doi.org/10.1093/qje/qjae044](https://doi.org/10.1093/qje/qjae044)
- CrewAI. (2026). *Introduction* [Documentation]. [https://docs.crewai.com/en/introduction](https://docs.crewai.com/en/introduction)
- Dillon, E. W., Jaffe, S., Immorlica, N., & Stanton, C. T. (2025). *Shifting work patterns with generative AI* (arXiv:2504.11436). [https://arxiv.org/abs/2504.11436](https://arxiv.org/abs/2504.11436)
- ElevenLabs. (2026). *Agents Platform overview* [Documentation]. [https://elevenlabs.io/docs/agents-platform/overview](https://elevenlabs.io/docs/agents-platform/overview)
- Gartner. (2025, June 25). *Gartner predicts over 40% of agentic AI projects will be canceled by end of 2027* [Press release]. [https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027)
- Google. (2025, November 18). *Gemini 3 brings upgraded smarts and new capabilities to the Gemini app*. [https://blog.google/products/gemini/gemini-3-gemini-app/](https://blog.google/products/gemini/gemini-3-gemini-app/)
- Humlum, A., & Vestergaard, E. (2026). *Still waters, rapid currents: Early labor market transformation under generative AI* (NBER Working Paper No. 33777). [https://www.nber.org/papers/w33777](https://www.nber.org/papers/w33777)
- Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., & Narasimhan, K. (2024). *SWE-bench: Can language models resolve real-world GitHub issues?* ICLR 2024. [https://arxiv.org/abs/2310.06770](https://arxiv.org/abs/2310.06770)
- Kurian, T. (2025, October 9). *Introducing Gemini Enterprise*. Google Cloud. [https://cloud.google.com/blog/products/ai-machine-learning/introducing-gemini-enterprise](https://cloud.google.com/blog/products/ai-machine-learning/introducing-gemini-enterprise)
- Kwa, T., West, B., Becker, J., et al. (2025, March 19). *Measuring AI ability to complete long tasks*. METR. [https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/)
- LangChain. (2026). *Interrupts* [LangGraph documentation]. [https://docs.langchain.com/oss/python/langgraph/interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts)
- Linux Foundation. (2026, April 9). *A2A protocol surpasses 150 organizations, lands in major cloud platforms, and sees enterprise production use in first year* [Press release]. [https://www.linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year](https://www.linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year)
- Microsoft. (2026). *Overview: Microsoft Copilot Studio* [Documentation]. [https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio)
- n8n. (2026). *Human-in-the-loop for AI tool calls* [Documentation]. [https://docs.n8n.io/advanced-ai/human-in-the-loop-tools/](https://docs.n8n.io/advanced-ai/human-in-the-loop-tools/)
- OpenAI. (2026). *OpenAI Agents SDK* [Documentation]. [https://openai.github.io/openai-agents-python/](https://openai.github.io/openai-agents-python/)
- Salesforce. (2025, October 13). *Welcome to the agentic enterprise: With Agentforce 360, Salesforce elevates human potential in the age of AI* [Press release]. [https://www.salesforce.com/news/press-releases/2025/10/13/agentic-enterprise-announcement/](https://www.salesforce.com/news/press-releases/2025/10/13/agentic-enterprise-announcement/)
- Schluntz, E., & Zhang, B. (2024, December 19). *Building effective agents*. Anthropic. [https://www.anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents)
- ServiceNow. (2026, May 5). *ServiceNow brings Autonomous Workforce to every major business function* [Press release]. [https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-brings-Autonomous-Workforce-to-every-major-business-function/default.aspx](https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-brings-Autonomous-Workforce-to-every-major-business-function/default.aspx)
- Stanford Institute for Human-Centered Artificial Intelligence. (2026). *Artificial Intelligence Index Report 2026*. Stanford University. [https://hai.stanford.edu/ai-index/2026-ai-index-report](https://hai.stanford.edu/ai-index/2026-ai-index-report)
- UiPath. (2025, April 30). *UiPath launches the first enterprise-grade platform for agentic automation* [Press release]. [https://www.uipath.com/newsroom/uipath-launches-first-enterprise-grade-platform-for-agentic-automation](https://www.uipath.com/newsroom/uipath-launches-first-enterprise-grade-platform-for-agentic-automation)
- Yao, S., Zhao, J., Yu, D., Du, N., Shafran, I., Narasimhan, K., & Cao, Y. (2023). *ReAct: Synergizing reasoning and acting in language models*. ICLR 2023. [https://arxiv.org/abs/2210.03629](https://arxiv.org/abs/2210.03629)
- Zapier. (n.d.-a). *Zapier Agents*. [https://zapier.com/agents](https://zapier.com/agents)
- Zapier. (n.d.-b). *Use Human in the Loop to pause Zap workflows pending human review* [Help center]. [https://help.zapier.com/hc/en-us/articles/38733184458765](https://help.zapier.com/hc/en-us/articles/38733184458765)
- Zeff, M. (2025, July 17). OpenAI launches a general purpose agent in ChatGPT. *TechCrunch*. [https://techcrunch.com/2025/07/17/openai-launches-a-general-purpose-agent-in-chatgpt/](https://techcrunch.com/2025/07/17/openai-launches-a-general-purpose-agent-in-chatgpt/)
