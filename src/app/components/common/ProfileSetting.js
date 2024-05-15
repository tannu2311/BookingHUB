'use client'
import styles from '@/style/profile.module.css';
import { callAPI } from '@/utils/API';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { Form } from '@/utils/formValidator';
import { Skeleton, Stack, CircularProgress } from '@mui/material';

function ProfileSetting() {

  const { register, handleSubmit, formState: { errors }, reset, setError } = useForm();
  const [loading, setLoading] = useState(true)
  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [email, setemail] = useState('');
  const [editMode, setEditMode] = useState(false)
  const [btnLoader, setBtnLoader] = useState(false);
  const [passRequired, setPassRequired] = useState(false);

  useEffect(() => {
    getProfile()
  }, [])

  const getProfile = () => {
    callAPI({
      method: 'GET',
      url: 'common'
    }, (data) => {
      setLoading(false)
      setemail(data.user.email);
      setfirstname(data.user.firstname)
      setlastname(data.user.lastname)
      setPassRequired(false);
      reset({
        firstname: data.user.firstname,
        lastname: data.user.lastname,
        email: data.user.email
      })

    })
  }


  const onSubmit = (updatedvalues) => {

    const newupdates = {
      firstname: updatedvalues.firstname,
      lastname: updatedvalues.lastname,
      email: updatedvalues.email,
    }

    let allSet = true;

    if (updatedvalues.con_password && updatedvalues.curr_password && updatedvalues.new_password) {
      if (updatedvalues.new_password != updatedvalues.con_password) {
        setError('con_password', { type: "custom", message: "Your passwords do not match." });
        allSet = false;
        return;
      }
      newupdates.current_password = updatedvalues.curr_password;
      newupdates.password = updatedvalues.new_password;
    } else if (updatedvalues.con_password == "" && updatedvalues.curr_password == "" && updatedvalues.new_password == "") {
      allSet = true;
    } else {
      Object.keys(updatedvalues).forEach((key) => {
        (updatedvalues[key] == "") && setError(key, { type: "custom", message: "This field is required." });
      })
      setPassRequired(true);

      allSet = false;
    }
    if (allSet) {
      setBtnLoader(true);
      callAPI({
        method: 'PUT',
        url: 'common',
        data: newupdates
      }, (res) => {
        if (res.status == 1) {
          getProfile();
          setEditMode(false)
        }
        setBtnLoader(false)
      })
    }
  }

  const handleEditClick = () => {
    setEditMode(!editMode);
  };


  return (
    <div>

      <div className='profile_page'>

        <div className={styles.profile_main}>
          {loading ?
            <Stack direction="row" spacing={3}>
              <Skeleton variant="circular" width={90} height={90} />
              <Skeleton variant="rectangular" width={310} height={100} />
            </Stack>
            :
            <div className={styles.profile_first_section}>
              <div className={styles.profile_content}>

                <div className={styles.upload_file_box} >
                  <div className={styles.upload_file_label} >
                    <img src={'/dummy_profile.png'} alt="Profile_image" style={{ width: '100%' }} />
                  </div>
                </div>


                <div className={styles.profile_name}>
                  <h3>{firstname} {lastname}</h3>
                  <p>{email}</p>
                </div>
              </div>

              <button type="button" onClick={handleEditClick} className="ap_btn mx_151">{editMode ? 'Cancel' : 'Edit'}</button>
            </div>}

          {editMode && (
            <div className={styles.profile_second}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <h2>Personal Details </h2>
                <div className='input_wrapper_list'>
                  <Form fieldname='firstname' label='First Name' inputType='text' register={register} errors={errors} applyValidation={true} isRequired={true} />
                  <Form fieldname='lastname' label='Last Name' inputType='text' register={register} errors={errors} applyValidation={true} isRequired={true} />
                </div>

                <div className='input_wrapper_list'>
                  <Form fieldname='email' label='Email' inputType='email' register={register} errors={errors} isDisable={true} />
                </div>

                <h2>Change Password </h2>
                <Form inputType={'password'} fieldname={'curr_password'} label={'Current Password'} register={register} errors={errors} isRequired={passRequired} />
                <Form inputType={'password'} fieldname={'new_password'} label={'New Password'} register={register} errors={errors} isRequired={passRequired} />
                <Form inputType={'password'} fieldname={'con_password'} label={'Confirm Password'} register={register} errors={errors} isRequired={passRequired} />

                <button type='submit' className="ap_btn mx_151" disabled={btnLoader}>Update
                  {btnLoader ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : ''}
                </button>
              </form>

            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default ProfileSetting
