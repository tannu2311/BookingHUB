import styles from '@/style/sidebar.module.css';
import { Skeleton } from '@mui/material';

function CommonLoader() {
    return (
        <>
    
            <div className={styles.sidebar_wrapper}>
                <div className={styles.logo}>
                    <Skeleton variant="rounded" width={215} height={40} />
                </div>


                <div className={styles.menu_wrapper}>
                    <ul>

                        {[1, 2, 3, 4, 5].map(val => <li key={val}>
                            <Skeleton variant="rounded" width={235} height={40} sx={{ marginBottom: '5px' }} />
                        </li>)}

                    </ul>
                </div>
            </div>

            <div className="page_title_wrap">
                <Skeleton variant="rounded" width={135} height={30} sx={{ marginBottom: '5px' }} />
            </div>

            <div className='content_wrapper'>
                <Skeleton variant="rounded" sx={{ width: { xl: '1200', md: '550', sm: '200' }, marginBottom: '5px' }} height={550} />

            </div>

        </>
    )
}

export default CommonLoader





export function Loader(props) {
    return (
        <div className="pre_loader">
        <div className="loader">
            <span></span>
            <span></span>
        </div>
        </div>
    )
}