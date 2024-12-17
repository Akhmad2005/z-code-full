import { Language } from '@/utilities/enums/language';
import { NextRequest, NextResponse } from 'next/server';
import { checkTwoSumTestCases } from '@/utilities/functions/tasks';
import { languages } from '@/utilities/const/languages';
import { capitalizeFirstWord } from '@/utilities/functions/text';

interface Body {
	code: string;
	language: Language;
}

interface Params {
  slug: string;
}

const checkTestMethods: Record<string, Function> = {
	'two-sum': checkTwoSumTestCases
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
	try {
		let {code, language}: Body = await req.json();
		if (!languages.includes(language)) {
			return NextResponse.json(
				{ status: "error", message: `Unsupported language. "${capitalizeFirstWord(language)}"` },
				{ status: 400 }
			);
		}

		const result = await checkTestMethods[params.slug](code, language);

		return NextResponse.json({
			...result,
		});
	} catch (error) {
		return NextResponse.json({
			status: "error",
			error: error,
		}, {status: 500});
	}
}
