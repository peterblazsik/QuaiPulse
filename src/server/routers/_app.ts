import { router } from "../trpc";
import { budgetRouter } from "./budget";
import { priorityRouter } from "./priority";
import { checklistRouter } from "./checklist";
import { dossierRouter } from "./dossier";
import { subscriptionRouter } from "./subscription";
import { gymFilterRouter } from "./gymFilter";
import { apartmentFeedPrefsRouter } from "./apartmentFeedPrefs";
import { apartmentsRouter } from "./apartments";
import { katieRouter } from "./katie";
import { sleepRouter } from "./sleep";
import { chatRouter } from "./chat";
import { languageRouter } from "./language";
import { profileRouter } from "./profile";

export const appRouter = router({
  budget: budgetRouter,
  priority: priorityRouter,
  checklist: checklistRouter,
  dossier: dossierRouter,
  subscription: subscriptionRouter,
  gymFilter: gymFilterRouter,
  apartmentFeedPrefs: apartmentFeedPrefsRouter,
  apartments: apartmentsRouter,
  katie: katieRouter,
  sleep: sleepRouter,
  chat: chatRouter,
  language: languageRouter,
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;
