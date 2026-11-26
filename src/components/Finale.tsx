import JoinForm from "./JoinForm";

export default function Finale() {
  return (
    <section id="finale" aria-labelledby="finale-title" className="flex min-h-screen items-center justify-center px-6 py-24 sm:px-12">
      <div className="w-full max-w-2xl text-shadow">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">The bottom, and what comes next</p>
        <h2 id="finale-title" className="mt-3 font-display text-4xl leading-[1.05] sm:text-6xl">
          Join the next descent
        </h2>
        <p className="mt-5 max-w-xl text-white/80">
          Lamina is a fictional expedition. Leave your details to see how a sign-up flow like this works end to end.
        </p>
        <div className="mt-8">
          <JoinForm />
        </div>
      </div>
    </section>
  );
}
