
import { BrainCircuit, Info } from "lucide-react";

const DoctorAISymptomPanel = ({
  analysis = null,
  loading = false,
  error = "",
}) => {
  const suggestions = Array.isArray(
    analysis?.possible_conditions
  )
    ? analysis.possible_conditions
    : [];

  return (
    <section className="rounded-[22px] border border-white/70 bg-white/80 p-5 shadow-sm">

      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#dff3ee] text-[#18a999]">
          <BrainCircuit size={20} />
        </div>

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#18a999]">
            Decision Support
          </p>

          <h3 className="text-lg font-black text-[#263d3c]">
            AI Symptom Analysis
          </h3>
        </div>
      </div>

      {loading ? (
        <p className="mt-5 text-sm text-[#607b79]">
          Loading symptom analysis...
        </p>
      ) : error ? (
        <p
          role="alert"
          className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      ) : analysis ? (
        <div className="mt-5 space-y-4">

          <div className="rounded-xl bg-[#edf7f4] p-4">
            <p className="text-xs font-bold text-[#38514f]">
              Symptom summary
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm text-[#607b79]">
              {analysis.summary ||
                "No symptom summary provided."}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold text-[#38514f]">
              Possible conditions
            </p>

            {suggestions.length ? (
              <ul className="mt-2 space-y-2">
                {suggestions.map((item, index) => (
                  <li
                    key={`${index}-${
                      typeof item === "string"
                        ? item
                        : item?.condition || "condition"
                    }`}
                    className="rounded-xl border border-[#dcece9] p-3 text-sm text-[#38514f]"
                  >
                    {typeof item === "string"
                      ? item
                      : item?.condition ||
                        item?.name ||
                        "Unspecified condition"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-[#78908e]">
                No suggestions available.
              </p>
            )}
          </div>

        </div>
      ) : (
        <p className="mt-5 rounded-xl bg-[#edf7f4] p-4 text-sm text-[#607b79]">
          No AI analysis loaded. This panel will use
          real analysis results once the AI service
          is connected.
        </p>
      )}

      <div className="mt-4 flex gap-2 text-xs leading-5 text-[#78908e]">
        <Info
          size={15}
          className="mt-0.5 shrink-0"
        />

        AI output is decision support, not a diagnosis.
        The physician must evaluate the patient independently.
      </div>

    </section>
  );
};

export default DoctorAISymptomPanel;
