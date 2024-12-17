import { Task } from "../interfaces/task"

export const tasks: Task[] = [
	{
		description: `
		<h2>1. Two Sum</h2>
		<p>
			Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. 
		</p>
		<p>
			You may assume that each input would have exactly one solution, and you may not use the same element twice. 
		</p>
		<p>You can return the answer in any order.</p>`,
		slug: 'two-sum',
		initialCode: {
			javascript: 
			`/**\n* @param {number[]} nums\n* @param {number} target\n* @return {number[]}\n*/\nvar twoSum = function(nums, target) {};`,
			python: 
			`class Solution(object):\n	def twoSum(self, nums, target):\n		"""\n		:type nums: List[int]\n		:type target:\n		int\n		:rtype: List[int]\n		"""`,
		},
		runCodeFunctionName: {
			javascript: 'twoSum',
			python: '',
		},
	}
] 