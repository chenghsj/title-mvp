export type Review = {
  Clarity: number;
  Organization: number;
  Fluency: number;
  Relevance: number;
  Communication: number;
  Engagement: number;
  Suggestions: string[];
};

export const dummyReviews: Review[] = [
  {
    Clarity: 7,
    Organization: 6,
    Fluency: 7,
    Relevance: 8,
    Communication: 6,
    Engagement: 7,
    Suggestions: [
      'The introduction could be stronger by starting with a compelling hook or question.',
      'Provide more context in the methodology section to clarify how the chosen research method is ideal for the problem.',
      'Some sentences could be made more concise for better readability.',
      'Including concrete examples of past work would make your qualifications more persuasive.',
    ],
  },
  {
    Clarity: 8,
    Organization: 7,
    Fluency: 8,
    Relevance: 9,
    Communication: 7,
    Engagement: 8,
    Suggestions: [
      'Consider expanding on the key findings to make the implications of the research more impactful.',
      'The transitions between sections could be smoother to enhance flow.',
      'Some technical terms may need brief explanations for a general audience.',
      'Add a section that clearly outlines your future research or career goals for a more complete narrative.',
    ],
  },
  {
    Clarity: 9,
    Organization: 8,
    Fluency: 7,
    Relevance: 7,
    Communication: 8,
    Engagement: 7,
    Suggestions: [
      'Integrate more specific examples to support your claims, especially in the results section.',
      'Improve the coherence of ideas by ensuring each paragraph naturally leads into the next.',
      'Simplify the language in certain technical areas to make the content more accessible.',
      'Introduce a unique perspective or insight in the conclusion to leave a lasting impression.',
    ],
  },
  {
    Clarity: 7,
    Organization: 6,
    Fluency: 6,
    Relevance: 7,
    Communication: 7,
    Engagement: 6,
    Suggestions: [
      'The abstract could be more concise, focusing on the key objectives and findings.',
      'Enhance the organization by outlining your main points in the introduction for better structure.',
      'Avoid long, complex sentences by breaking them down into simpler ideas.',
      'Use more active voice to make the writing more dynamic and engaging.',
    ],
  },
  {
    Clarity: 8,
    Organization: 7,
    Fluency: 7,
    Relevance: 8,
    Communication: 8,
    Engagement: 7,
    Suggestions: [
      'Make the introduction more engaging by highlighting a relevant statistic or interesting fact.',
      'Provide a clearer roadmap of the paper’s structure to help guide the reader.',
      'Simplify the more jargon-heavy sections to make them accessible to a broader audience.',
      'Adding a reflection on challenges faced during the project could make the process more relatable.',
    ],
  },
  {
    Clarity: 6,
    Organization: 7,
    Fluency: 7,
    Relevance: 8,
    Communication: 6,
    Engagement: 7,
    Suggestions: [
      'The main argument is somewhat unclear; try to present it more directly in the introduction.',
      'Consider reordering some paragraphs for a more logical flow.',
      'Certain points feel repetitive; condense them to maintain the reader’s interest.',
      'Include a brief discussion of related works to situate your research in a broader context.',
    ],
  },
  {
    Clarity: 9,
    Organization: 8,
    Fluency: 8,
    Relevance: 9,
    Communication: 8,
    Engagement: 8,
    Suggestions: [
      'Consider adding a brief, catchy summary at the end to reinforce your key points.',
      'Expand on the implications of your findings, showing how they can be applied in real-world situations.',
      'Use headings and subheadings to break up longer sections for improved readability.',
      'Highlight any unique or innovative aspects of your approach earlier in the introduction.',
    ],
  },
  {
    Clarity: 8,
    Organization: 7,
    Fluency: 6,
    Relevance: 8,
    Communication: 7,
    Engagement: 7,
    Suggestions: [
      'The conclusion could better summarize the key takeaways of the research.',
      'Strengthen the argument by integrating more evidence or citations to support your claims.',
      'Some sentences are a bit long and could be shortened for clarity.',
      'Add a personal reflection or anecdote to make the narrative more relatable and engaging.',
    ],
  },
  {
    Clarity: 7,
    Organization: 7,
    Fluency: 7,
    Relevance: 8,
    Communication: 7,
    Engagement: 7,
    Suggestions: [
      'Improve the flow between ideas by using transition sentences at the start of each paragraph.',
      'Consider rephrasing complex sentences to enhance clarity.',
      'More detailed examples would strengthen your arguments, particularly in the discussion section.',
      'The introduction would benefit from a stronger thesis statement to clearly indicate your research focus.',
    ],
  },
  {
    Clarity: 8,
    Organization: 8,
    Fluency: 8,
    Relevance: 9,
    Communication: 8,
    Engagement: 8,
    Suggestions: [
      'Expand on the background information to provide more context for the reader.',
      'Improve the overall organization by adding clear section breaks and headings.',
      'Make the abstract more concise by focusing on the most important results.',
      'Incorporating a future outlook on how this research can evolve would make the conclusion more impactful.',
    ],
  },
];
