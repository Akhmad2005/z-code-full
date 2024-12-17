'use client'
import styles from './page.module.scss' 
import { Splitter, Space, Empty, Flex, Button, Select, message, Spin } from 'antd'
import { CodeOutlined, CheckSquareOutlined, FileTextOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import Image from 'next/image'
import LoginModal from "@/app/components/modal/login";
import { useCookies } from 'next-client-cookies'
import { useRouter } from '@/i18n/routing'
import { tasks } from '@/utilities/const/tasks'
import { Task } from '@/utilities/interfaces/task'
import { Language } from '@/utilities/enums/language'
import { languages } from '@/utilities/const/languages'
import { capitalizeFirstWord } from '@/utilities/functions/text'

// Dynamically import CodeEditor to avoid SSR issues
const CodeEditor = dynamic(() => import('@/app/components/editor/index'), {
  ssr: false, // Disable server-side rendering
});

interface Props {
	params: {
		slug: string;
	}
}

interface CodeResult {
	status: 'success' | 'error',
	message?: string,
}

const Page = ({params}: Props) => {
	const cookies = useCookies();
	const router = useRouter();
	const [device, setDevice] = useState<string>();
	const [running, setRunning] = useState<boolean>(false);
	const [code, setCode] = useState<string>('');
	const [codeResult, setCodeResult] = useState<CodeResult>();
	const [task, setTask] = useState<Task>();
	const [editorLanguage, setEditorLanguage] = useState<Language>(Language.javascript);
	const [loginModalOpened, setLoginModalOpened] = useState<boolean>(false);

  const handleLanguageChange = (l: Language) => {
    setEditorLanguage(l);
		if (task) {
			let localTask = localStorage.getItem(`${params.slug}_${l}`)
			if (localTask) {
				setCode(localTask);
			} else {
				setCode(task.initialCode[l]);
			}
		}
  };

	const handleCodeChange = (value: string) => {
    setCode(value);
  };

	const handleRun = async () => {
		setRunning(true);
		if (editorLanguage == 'javascript') {
			try {
				let res = await fetch('/api/tasks/two-sum', 
					{
						method: 'POST',
						body: JSON.stringify({
							code: code,
							language: editorLanguage,
						})
					}
				)
				setCodeResult(await res.json());
			} catch (error) {
				console.error(error);
			}
		} else {
			message.info(`Upgrade to Premium for running ${capitalizeFirstWord(editorLanguage)}`);
		}
		setRunning(false);
	} 

	useEffect(() => {
		let task = tasks.find(t => t.slug == params.slug)		
		if (task) {
			setTask(task)
			let localTask = localStorage.getItem(`${params.slug}_${editorLanguage}`)
			if (localTask) {
				setCode(localTask)
			} else {
				setCode(task.initialCode[editorLanguage])
			}
		}
	}, [])
	useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 991) {
        setDevice('mdAndSmaller');
      } else {
        setDevice('lgAndBigger');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

	return (
		<div className={styles['page']}>
			<Splitter layout={device == 'mdAndSmaller' ? 'vertical' : 'horizontal'} >
				<Splitter.Panel defaultSize={'30%'} min="20%" max="70%">
					<div className={styles['page-panel']}>
						<header className={styles['page-panel-header']}>
							<Space>
								<FileTextOutlined />
								Description
							</Space>
						</header>
						<main className={`${styles['page-panel-body']} ${styles['task_description']}`}>
							<div dangerouslySetInnerHTML={{__html: task?.description || ''}}></div>
						</main>
					</div>
				</Splitter.Panel>
				<Splitter.Panel>
					<Splitter layout="vertical">
						<Splitter.Panel defaultSize={'70%'} max={'70%'}>
						<div className={styles['page-panel']}>
							<header className={styles['page-panel-header']}>
								<Space>
									<CodeOutlined />
									Code
								</Space>
							</header>
							<main className={`${styles['page-panel-body']} ${styles['page-panel-code_editor']}`}>
								<nav className={`${styles['page-panel-code_editor-toolbar']}`}>
									<Select 
										size='small'
										showSearch={false}
										suffixIcon={false}
										variant='borderless'
										value={editorLanguage}
										options={
											languages.map(l => ({
												value: l,
												label: capitalizeFirstWord(l)
											}))
										}
										onChange={handleLanguageChange}
									>

									</Select>
								</nav>
								<div className={`${styles['page-panel-code_editor-editor']}`}>
									<CodeEditor slug={params.slug} onChange={handleCodeChange} code={code} language={editorLanguage}/>
								</div>
								<footer className={`${styles['page-panel-code_editor-footer']}`}>
									<Flex justify="flex-end" align="center" style={{ height: '100%' }}>
										<Button loading={running} onClick={handleRun} size='small' type='primary'>
											{
												running ? 'Running...' : 'Run'
											}
										</Button>
									</Flex>
								</footer>
							</main>
						</div>
						</Splitter.Panel>
						<Splitter.Panel>
							<div className={styles['page-panel']}>
								<header className={styles['page-panel-header']}>
									<Space>
										<CheckSquareOutlined />
										Result
									</Space>
								</header>
								<main className={styles['page-panel-body']}>
									{
										!codeResult 
										?
										<Flex justify="center" align="center" style={{ height: '100%' }}>
											<Empty image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>
										</Flex> 
										:
										<div>
											{
												codeResult.status ==='success' 
												?
												<div className={styles['result_success']}>
													<h2>
														Accepted
													</h2>
												</div>
												:
												<div className={styles['result_error']}>
													<h2>
														Failed
													</h2>
												</div>
											}
											<div className={styles['result_message']} dangerouslySetInnerHTML={{__html: codeResult.message || ''}}></div>
										</div>
									}
								</main>
							</div>
						</Splitter.Panel>
					</Splitter>
				</Splitter.Panel>
			</Splitter>
			<LoginModal open={loginModalOpened} changeOpen={setLoginModalOpened}></LoginModal>
		</div>
	)
}

export default Page;