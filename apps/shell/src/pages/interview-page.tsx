const topics = [
  {
    question: "What are micro-frontends?",
    answer:
      "Split the UI by business domain so teams can build, deploy, and scale independently.",
  },
  {
    question: "Where does routing live?",
    answer:
      "In the shell (this app). Deep links are shell routes; remotes render into route slots.",
  },
  {
    question: "How do you share React?",
    answer:
      "Module Federation shared config with singleton react and react-dom.",
  },
  {
    question: "What if a remote fails?",
    answer:
      "Error boundary + import catch shows fallback UI without crashing the shell.",
  },
];

export function InterviewPage() {
  return (
    <section className="shell-page">
      <h2>Interview talking points</h2>
      <p>
        Full notes: <code>apps/docs/interview-guide.md</code>
      </p>
      <dl className="interview-list">
        {topics.map((topic) => (
          <div className="interview-item" key={topic.question}>
            <dt>{topic.question}</dt>
            <dd>{topic.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
