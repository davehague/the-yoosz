import { defineNitroPlugin } from "nitropack/runtime/plugin";
import { useMealPlanner } from "~/composables/useMealPlanner";

export default defineNitroPlugin((nitroApp) => {
  startPeriodicMealPlan(nitroApp);
});

async function startPeriodicMealPlan(nitroApp: any) {
  const { createAndSendMealPlan } = useMealPlanner();

  nitroApp.hooks.hook(
    "onSchedule",
    async (event: any) => {
      console.log("Running scheduled meal plan generation and email sending");
      await createAndSendMealPlan();
    },
    { schedule: "0 7 * * 4" } // "At 07:00 on Thursday"
  );

  console.log("Running meal plan generation and email sending (if uncommented)");
//   await createAndSendMealPlan();
}
