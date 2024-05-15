"use client"
import svg from "@/utils/svg";
import Link from "next/link";
import styles from '@/style/sidebar.module.css';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useRef } from "react";
import { common } from '@/utils/helper';
import { setHideShowSidebarPopup } from '../../redux/commonSlice'
import { Loader } from "../loader/CommonLoader";


const Sidebar = () => {
    const pathname = usePathname()
    const SidebarRef = useRef();
    const menuToggle = useSelector((store) => store.storeData.common.menuToggle)
    const user = useSelector((store) => store.storeData.auth.user)
    const dispatch = useDispatch();

    let i = 0;
    common.useOutsideClick(SidebarRef, () => {
        i++;
        if (i > 1) {
            dispatch(
                setHideShowSidebarPopup(false)
            )
        }
    });
    
    const hideSidebar =() =>{
        dispatch(
            setHideShowSidebarPopup(false)
        ) 
    }
    if (user?.email) {
        return (
            <>
                <div className={(menuToggle) ? "in overlay_dark" : ''}></div>

                <div ref={SidebarRef} className={menuToggle ? styles.sidebar_wrapper + " " + styles.sidebar_show : styles.sidebar_wrapper}>
                    <div className={styles.logo}>
                    <img src={process.env.LOGO_IMG} alt="logo"/>
                    </div>


                    <div className={styles.menu_wrapper}>
                        <ul>
                            
                            {user?.role == 1 ? <><li>
                                <Link href="/admin/dashboard" className={(pathname == '/admin/dashboard') ? styles.active : ''} onClick={hideSidebar}>
                                    <span>{svg.dashboard}</span>  Dashboard
                                </Link>
                            </li>
                                <li>
                                    <Link href="/admin/user" className={(pathname == '/admin/user') ? styles.active : ''} onClick={hideSidebar}>
                                        <span> {svg.user}</span> User
                                    </Link>
                                </li>

                                <li>
                                    <Link href="/admin/plans" className={(pathname == '/admin/plans') ? styles.active : ''} onClick={hideSidebar}>
                                        <span>{svg.plan}</span> Plans
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin/payment" className={(pathname == '/admin/payment') ? styles.active : ''} onClick={hideSidebar}>
                                        <span>{svg.payment}</span> Payment
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin/settings" className={(pathname == '/admin/settings') ? styles.active : ''} onClick={hideSidebar}>
                                        <span>{svg.setting}</span> Settings
                                    </Link>
                                </li>
                               
                                <li>
                                <Link href="/admin/trash" className={(pathname == '/admin/trash') ? styles.active : ''} onClick={hideSidebar}>
                                    <span>{svg.trash}</span> Trash
                                </Link>
                                </li>

                                <li>
                                <Link href="/admin/contactMessages" className={(pathname == '/admin/contactMessages') ? styles.active : ''} onClick={hideSidebar}>
                                    <span>{svg.contacts}</span> Contact Messages
                                </Link>
                                </li>
                            </>
                                :
                                <>
                                    <li>
                                        <Link href="/user/dashboard" className={(pathname == '/user/dashboard') ? styles.active : ''}  onClick={hideSidebar}>
                                            <span>{svg.dashboard}</span> Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/user/campaigns" className={(pathname == '/user/campaigns' || pathname == '/user/createcampaigns') ? styles.active : ''}  onClick={hideSidebar}>
                                            <span>{svg.dash_campaign}</span> Campaigns
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/user/registrations" className={(pathname == "/user/registrations") ? styles.active : ''} onClick={hideSidebar}>
                                            <span>{svg.user}</span> Registrations
                                        </Link>
                                    </li>

                                    <li>
                                        <Link href="/user/integrations" className={(pathname == '/user/integrations') ? styles.active : ''} onClick={hideSidebar}>
                                            <span>{svg.payment}</span> Integrations
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/user/settings" className={(pathname == '/user/settings') ? styles.active : ''} onClick={hideSidebar}>
                                            <span>{svg.setting}</span> Settings
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/user/email_setting" className={(pathname == '/user/email_setting') ? styles.active : ''} onClick={hideSidebar}>
                                            <span>{svg.email_setting}</span> Email Settings
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/user/trash" className={(pathname == '/user/trash') ? styles.active : ''} onClick={hideSidebar}>
                                            <span>{svg.trash}</span> Trash
                                        </Link>
                                    </li>
                                </>
                            }
                                   
                        </ul>
                    </div>

                </div>
            </>
        );
    }else{
        <Loader/>
    }


}


export default Sidebar