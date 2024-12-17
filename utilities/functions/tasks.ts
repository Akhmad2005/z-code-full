import { runCode } from "./codeRunner";

export function generateTwoSumTestCases(count: number = 100) {
	const testCases = [];

	for (let id = 1; id <= count; id++) {
			const size = Math.floor(Math.random() * 20) + 2;
			const nums = new Array(size).fill(0);

			const index1 = Math.floor(Math.random() * size);
			let index2;
			do {
					index2 = Math.floor(Math.random() * size);
			} while (index2 === index1);

			const num1 = Math.floor(Math.random() * 200) - 100;
			const num2 = Math.floor(Math.random() * 200) - 100;
			const target = num1 + num2;

			nums[index1] = num1;
			nums[index2] = num2;

			// Fill the rest of the array, ensuring no other pair sums to the target
			for (let i = 0; i < size; i++) {
					if (i !== index1 && i !== index2) {
							let randomNum: number;
							do {
									randomNum = Math.floor(Math.random() * 200) - 100;
							} while (
									randomNum + num1 === target || 
									randomNum + num2 === target || 
									nums.some((num, idx) => idx !== i && randomNum + num === target)
							);
							nums[i] = randomNum;
					}
			}

			testCases.push({
					id,
					nums,
					target,
					expectedOutput: [Math.min(index1, index2), Math.max(index1, index2)],
			});
	}

	return testCases;
}

export async function checkTwoSumTestCases(code: string, language: string) {
  const testCases = generateTwoSumTestCases(100);
  let lastError: string | null = null;
  let failedTestCaseId: number | null = null;
  let success = true;

  for (const testCase of testCases) {
    const { id, nums, target, expectedOutput } = testCase;
    const testCode = `${code}\n// Test Case ${id}\nconsole.log(twoSum(${JSON.stringify(nums)}, ${target}));`;

    try {
      const result = await runCode(testCode, language);

      const parsedResult = JSON.parse(result);
      if (JSON.stringify(parsedResult) !== JSON.stringify(expectedOutput)) {
        success = false;
        lastError = `
					Test case <b>${id}</b> failed. Expected: ${JSON.stringify(expectedOutput)}, Got: ${result}
					<br/>
					<b>Nums</b>: ${JSON.stringify(nums)},
					<br/>
					<b>Target</b>: ${JSON.stringify(target)}.
				`;
        failedTestCaseId = id;
        break; // stop at the first failure
      }
    } catch (error) {
      success = false;
      lastError = `Test case ${id} failed with error: ${error}`;
      failedTestCaseId = id;
      break; // stop at the first failure
    }
  }

  if (success) {
    return {
      status: "success",
      message: "All test cases passed successfully.",
    };
  } else {
    return {
      status: "error",
      message: lastError,
      failedTestCaseId,
    };
  }
}