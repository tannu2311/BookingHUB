"use client"
import svg from '@/utils/svg';
import Avatar from '@mui/material/Avatar';
import { useRef, useState, useEffect } from 'react';
import styles from '@/style/sidebar.module.css'
import { common } from '@/utils/helper';
import { signOut ,useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@mui/material';
import { useDispatch,useSelector } from 'react-redux';
import { logoutRemoveUser } from '@/app/redux/authSlice';
import {setHideShowSidebarPopup} from '@/app/redux/commonSlice'
import { Loader } from '../loader/CommonLoader';



function PageTitle(props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const menuToggle = useSelector((store) => store.storeData.common.menuToggle)
  const userData = useSelector((store) => store.storeData.auth.user)
  const { data: token, status } = useSession()
 
  const logout = () => {
    setLoading(true)
    dispatch(logoutRemoveUser());
    signOut();
    router.push('/login')
  }

  let i = 0;
  const menuRef = useRef();
  common.useOutsideClick(menuRef, () => {
    i++;
    if (i > 1) {
      setOpen('');
    }
  });
 
  const handleClick = () => { 
    dispatch(
      setHideShowSidebarPopup(!menuToggle)
    )
  }
 
 if(!loading){
  return (
    <div className={`page_title_wrap  ${props.type == '404' ? "page_title_not_found" : ''}`} style={{marginRight:props.sideFilter ? '280px' : '0px'}} >
      {props.type == '404' ? <div><img  src={process.env.LOGO_IMG} alt='logo' /></div> : <h3>{props.title}</h3>}

      <div className='profile_wrapper'>
       {token ?  <> 
        <Avatar
          alt="Remy Sharp"
          src="/dummy_profile.png"
          sx={{ width: 50, height: 50 }}
        />
        {(userData?.firstname) ? <h4>{userData?.firstname} {userData?.lastname}</h4> : <Skeleton variant="rounded" width={100} height={20} />}
        <div className={open ? 'up_arrow' : 'down_arrow'} onClick={() => setOpen(!open)}>{svg.down_arrow}</div>
        <div className={`${open ? styles.menu_bar + " " + styles.show : styles.menu_bar} rtl_menu_bar`} ref={menuRef}>
          <ul>
            <li>
              <span>{svg.user}</span>
              <Link href={userData.role == 1 ? '/admin/settings' : '/user/settings'} >Profile</Link>
            </li>
            <li onClick={() => logout()}>
              <span>{svg.logout}</span>
              <span>Logout</span>
            </li>
          </ul>
        </div>
        </>
             :
        <div className={styles.not_found_link_wraper}>
          <div className={styles.links}> 
          <Link href={'/login'}>SignIn</Link>
          </div>
          <div  className={styles.links}> 
          <Link href={'/registration'}>SignUp</Link>
          </div>
        </div>}
        
        <div className={menuToggle ? "xs_nav_icon xs_cross" : "xs_nav_icon"} onClick={handleClick} >
          <div className={(menuToggle) ? "toggle" + " " + "activate" : "toggle"}>
            <span className="line_toggle"></span>
            <span className="line_toggle"></span>
            <span className="line_toggle"></span>
          </div>
        </div>
      </div>
    </div>
  )
}else{
  return <Loader/>
}
}

export default PageTitle