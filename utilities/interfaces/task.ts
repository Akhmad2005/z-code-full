import { Language } from "../enums/language";

export interface Task {
	description: string;
	slug: string;
  initialCode: Record<Language, string>;
  runCodeFunctionName: Record<Language, string>;
}

export interface TaskResults {
	slug: string;
	testCases: TestCase[];
}

interface TestCase {
	target: number;
	nums: number[];
	output: number[];
	id: number;
}