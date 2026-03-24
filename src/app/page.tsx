import StepWizard from "@/components/StepWizard";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">
        AI Workshop Participant
      </h1>
      <p className="text-center text-gray-600 mb-8">
        AI and Human Emotions &mdash; Pre-Texts Methodology
      </p>
      <StepWizard />
    </main>
  );
}
