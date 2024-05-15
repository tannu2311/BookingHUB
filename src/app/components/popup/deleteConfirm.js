
import styles from '@/style/Popup.module.css';


function ConfirmDeletePopup(props) {

    const handleConfirm = () => {
        props.handlePopUp(true);
    };

    const handleCancel = () => {
        props.handlePopUp(false);
    };

    return (
        <>
            <div className="text-center">
                <p className={styles.popup_confdelete}>Are you sure you want to delete?</p>
                <div className={styles.popup_btn_wrapper}>
                    <button  className="ap_btn delete_btn" type='button'  onClick={handleConfirm} >
                        Yes , Delete!
                    </button>
                    <button  className="cancel_btn" type='button' onClick={handleCancel} >
                        Cancel
                    </button>
                </div>
            </div>
        </>
    )
}

export default ConfirmDeletePopup



export function ResponderDisconnectPopUp(props){
    const handleConfirm = () => {
        props.handlePopUp(true);
    };

    const handleCancel = () => {
        props.handlePopUp(false);
    };

    return (
        <>
            <div className="text-center">
                <p className={styles.popup_confdelete}>Are you sure you want to disconnect {props.autoresponder}?</p>
                <div className={styles.popup_btn_wrapper}>
                    <button  className="ap_btn delete_btn" type='button'  onClick={handleConfirm} >
                        Disconnect
                    </button>
                    <button  className="cancel_btn" type='button' onClick={handleCancel} >
                        Cancel
                    </button>
                </div>
            </div>
        </>
    )
}


export function ConfirmRestorePopup(props){
    const handleConfirm = () => {
        props.handlePopUp(true);
    };

    const handleCancel = () => {
        props.handlePopUp(false);
    };

    return (
        <>
            <div className="text-center">
                <p className={styles.popup_confdelete}>Are you sure you want to Restore {props.name}?</p>
                <div className={styles.popup_btn_wrapper}>
                    <button  className="ap_btn delete_btn" type='button'  onClick={handleConfirm} >
                        Restore
                    </button>
                    <button  className="cancel_btn" type='button' onClick={handleCancel} >
                        Cancel
                    </button>
                </div>
            </div>
        </>
    )
}







