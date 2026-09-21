import {
  BrainCircuit,
  Sparkles,
} from "lucide-react";

const AISymptomPanel = () => {
  const predictions = [
    {
      condition: "Migraine",
      confidence: 72,
    },
    {
      condition:
        "Tension Headache",
      confidence: 18,
    },
    {
      condition:
        "Dehydration",
      confidence: 10,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3">
        <div
          className="
            grid
            h-11
            w-11
            place-items-center
            rounded-[15px]
            bg-[#dcf4ef]
            text-[#159f98]

            dark:bg-[#17413e]
            dark:text-[#66ddd4]
          "
        >
          <BrainCircuit
            size={20}
          />
        </div>

        <div>
          <p
            className="
              text-[10px]
              font-extrabold
              uppercase
              tracking-[0.14em]
              text-[#159f98]
            "
          >
            AI Decision Support
          </p>

          <h3
            className="
              mt-1
              text-[18px]
              font-black
              text-[#263d3c]
              dark:text-white
            "
          >
            Symptom Analysis
          </h3>
        </div>
      </div>

      <div
        className="
          mt-5
          rounded-[18px]
          bg-white/55
          p-4

          dark:bg-[#203331]
        "
      >
        <div className="flex gap-3">
          <Sparkles
            size={16}
            className="mt-[2px] shrink-0 text-[#159f98]"
          />

          <div>
            <p
              className="
                text-[11px]
                font-extrabold
                text-[#38514f]
                dark:text-[#dce8e6]
              "
            >
              Patient Summary
            </p>

            <p
              className="
                mt-2
                text-[12px]
                leading-6
                text-[#607b79]
                dark:text-[#91aaa7]
              "
            >
              Patient reports headache for two days with dizziness and mild
              sensitivity to light. No reported fever.
            </p>
          </div>
        </div>
      </div>

      <p
        className="
          mt-5
          text-[9px]
          font-extrabold
          uppercase
          tracking-[0.12em]
          text-[#829b99]
        "
      >
        Possible Conditions
      </p>

      <div className="mt-3 space-y-3">
        {predictions.map(
          (prediction) => (
            <div
              key={
                prediction.condition
              }
              className="
                rounded-[16px]
                bg-white/55
                p-4

                dark:bg-[#203331]
              "
            >
              <div className="flex justify-between">
                <p
                  className="
                    text-[12px]
                    font-extrabold
                    text-[#38514f]
                    dark:text-[#dce8e6]
                  "
                >
                  {
                    prediction.condition
                  }
                </p>

                <span
                  className="
                    text-[12px]
                    font-black
                    text-[#159f98]
                  "
                >
                  {
                    prediction.confidence
                  }
                  %
                </span>
              </div>

              <div
                className="
                  mt-3
                  h-[7px]
                  overflow-hidden
                  rounded-full
                  bg-[#dcece9]

                  dark:bg-[#29413f]
                "
              >
                <div
                  className="
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-[#18b7ae]
                    to-[#079fa9]
                  "
                  style={{
                    width: `${prediction.confidence}%`,
                  }}
                />
              </div>
            </div>
          )
        )}
      </div>

      <p
        className="
          mt-4
          text-[10px]
          leading-5
          text-[#829b99]
        "
      >
        AI suggestions are decision-support information only. The physician
        retains the final clinical assessment.
      </p>
    </div>
  );
};

export default AISymptomPanel;