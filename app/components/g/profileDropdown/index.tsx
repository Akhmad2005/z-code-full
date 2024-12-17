'use client'

import { Dropdown, Avatar, Modal, Button } from "antd";
import type { MenuProps } from "antd";
import {UserOutlined} from '@ant-design/icons'
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useMemo, useState } from "react";
import { useCookies } from "next-client-cookies";
import { exitFromAccount } from "@/utilities/functions/account";
import { useRouter } from "@/i18n/routing";
import styles from './index.module.scss'
import LoginModal from "../../modal/login";

const ProfileDropdown = () => {
	const router = useRouter();
	const cookies = useCookies();
	const token = cookies.get('auth-token');
	const pathName = usePathname();
	const t = useTranslations(); 
	const [loginModalOpened, setLoginModalOpened] = useState<boolean>(false);

	const menuList = useMemo<MenuProps['items']>(() => {
		let arr: MenuProps['items'] = [
			{
				key: '2',
				label: <span>
					{
						t('exit')
					}
				</span>,
				onClick: () => {
					exitFromAccount(cookies, router)
				},
				danger: true
			}
		]
		return arr
	}, [pathName])

	const handleClickAvatar = () => {
    if (!token && pathName !== '/auth' ) {
			setLoginModalOpened(true);
    }
  }

	return (
		<div>
			{
				!token 
				?
				<Avatar 
					onClick={handleClickAvatar}
					style={{backgroundColor: 'var(--primary-color)'}} 
					className="link" 
					size={'default'}
				>
					<UserOutlined></UserOutlined>
				</Avatar>
				:
				<Dropdown trigger={["click"]} placement="bottomRight" menu={{items: menuList}}>
					<Avatar style={{backgroundColor: 'var(--primary-color)'}} className="link" size={'default'}>
						<UserOutlined></UserOutlined>
					</Avatar>
				</Dropdown>
			}
			<LoginModal open={loginModalOpened} changeOpen={setLoginModalOpened}></LoginModal>
		</ div>
	)
}

export default ProfileDropdown;