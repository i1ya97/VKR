import { Domains } from "./Domains";

export type UseDomainsOutput = {
  maxValueForEntire: number | null;
  minValueForEntire: number | null;
  maxValuesForEachLine: Domains | null;
  minValuesForEachLine: Domains | null;
};
