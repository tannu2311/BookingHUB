import { useEffect, useState } from 'react';
import svg from '@/utils/svg';
import styles from '@/style/Popup.module.css';
import PropTypes from "prop-types";
const Popup = (props) => {
    const [show, setShow] = useState(false);
    const closeHandler = (e) => {
        setShow(false);
        props.onClose(false);
    };

    useEffect(() => {
        setShow(props.show);
        document.body.addEventListener('keyup', function(e) {
            if (e.key == "Escape") {
                closeHandler()
            }
        });
    }, [props.show]);
  
    return (
        <>
            <div id={props.popupid} className={styles.popup_wrapper + ' ' + (show ? styles.in : '')}>
                <div className={styles.popup_inner} style={{maxWidth: (props.maxWidth?props.maxWidth:'') }}>
                    <div className={styles.popup_close} onClick={closeHandler}>{svg.popup_close}</div>
                    {props.heading ?
                        <div className={styles.popup_heading_wrapper}>

                            {(props.type == 'delete') ? <div className={styles.conf_del_icon}>{svg.conf_delete_elacamation}</div> : null}
                            {props.heading ? <div className={styles.popup_heading}>{props.heading}</div> : ''}
                            {props.subHeading ? <div className={styles.popup_subheading}>{props.subHeading}</div> : ''}

                        </div>
                        : null}
                    {props.children}
                </div>
                <div className={styles.popup_overlay_close} onClick={closeHandler}></div>
            </div>
        </>
    );
}

Popup.propTypes = {
   
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default Popup;