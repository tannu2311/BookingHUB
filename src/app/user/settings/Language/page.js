"use client"
import { Form } from '@/utils/formValidator';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import styles from "@/style/setting.module.css";
import { words, languageArray } from '@/utils/data';
import { callAPI } from '@/utils/API';

function LanguageSettings() {

  const [userlang, setuserlang] = useState({});
  const [addedLanguage, setAddedLanguage] = useState([]);

  const { reset, handleSubmit, formState: { errors }, control, register, watch, setValue } = useForm({ defaultValues: { word_type: 'common' } });
  let word_type = watch("word_type");
  let language = watch("language");
  let selectd_language = watch("selectd_language");

  const fetchUserData = () => {
    callAPI({
      method: 'GET',
      url: `/user/language`,
    }, (resp) => {
      if (resp.status == 1) {

        setuserlang(resp.data);
        const dataKeys = Object.keys(resp.data);
        const filteredLanguageArray = languageArray
          .filter(language => dataKeys.includes(language.value))
          .map(language => ({ ...language }));
        setAddedLanguage(filteredLanguageArray);
      }
    })
  }


  useEffect(() => {
    fetchUserData();
  }, [])

  useEffect(() => {
    language = selectd_language ? selectd_language : language;
    if (language) {
      reset();
    }
    if (userlang[language]) {
      reset({ ...userlang[language], 'word_type': word_type, "language": language ,'selectd_language':selectd_language})
    } else {
      reset({ ...{}, 'word_type': word_type, "language": language ,'selectd_language':selectd_language});
    }
  }, [language, word_type,selectd_language])


  const saveWords = (updatedval) => {

    let finalObj = {};
    finalObj['langcode'] = updatedval.language;
    delete updatedval['word_type'];
    delete updatedval['language'];
    if (word_type == 'common') {
      let obj = Object.fromEntries(Object.entries(updatedval).filter(([key, value]) => key >= 1 && key <= 44));
      finalObj['langdata'] = obj;
    } else if (word_type == 'appointment') {
      let obj = Object.fromEntries(Object.entries(updatedval).filter(([key, value]) => key >= 46 && key <= 57));
      finalObj['langdata'] = obj;
    } else if (word_type == 'event') {
      let obj = Object.fromEntries(Object.entries(updatedval).filter(([key, value]) => key >= 58 && key <= 69));
      finalObj['langdata'] = obj;
    } else {
      let obj = Object.fromEntries(Object.entries(updatedval).filter(([key, value]) => key >= 70 && key <= 100));
      finalObj['langdata'] = obj;
    }

    callAPI({
      method: 'POST',
      url: `/user/language`,
      data: finalObj
    }, (resp) => {
      if (resp.status == 1) {
        fetchUserData();
      }
    })

  }

  const handleNewLanguage = () => {
    reset();
    reset({ ...{}, 'word_type': word_type, "language": '' ,'selectd_language':''});
    setValue('language', '');
    setValue('selectd_language', '');
  }
  
 
  return (
    <div>
      <div className='profile_page'>
        <div className='lang_box_wrap'>
          <Form fieldname={'word_type'} label={``} inputType={"radio"} options={[{ label: 'Common', value: 'common' }, { label: 'Appointments', value: 'appointment' }, { label: 'Events', value: 'event' }, { label: 'Bookings', value: 'booking' }]} control={control} errors={errors} isRequired={true} />
          <div className={styles.header_flex_gap}>
            <button type='button' className="ap_btn" onClick={handleNewLanguage} >Add New Language</button>

           {addedLanguage.length > 0 && <div className={styles.language_box}>
              <Form fieldname="selectd_language" label={``} placeholder={'Selected Languages'} inputType={"select"} options={addedLanguage} control={control} errors={errors} isRequired={true} />
            </div>}
          </div>
        </div>

        <div className={`${styles.language_container} input_pad_zero`} style={{ width: '100%' }}>


          <div className={styles.lang_header_wrap + " " + styles.header}>
            <div className={styles.words} style={{ color: '#000' }}>
              Language
            </div>

            <div className={styles.language_box}>
              {/* {language && languageArray.find(obj => obj.value == language)?.label} */}
              <Form fieldname="language" label={``} inputType={"select"} options={languageArray} placeholder={'Select Language'} control={control} errors={errors} isRequired={true} />
            </div>
          </div>

          <div className={styles.content_box_wrap}>
            <form onSubmit={handleSubmit(saveWords)}>
              {(word_type == 'common') && Object.entries(words.commonWords).map(([id, word]) => (
                <div className={styles.lang_header_wrap + " " + styles.content_wrap} style={{ display: (word.length > 25) && 'block' }}>

                  <div className={`${styles.words} ${(word.length > 25) && styles.max_content}`} key={id} >
                    <span>{word}</span>
                  </div>
                  {/* {language && */}
                  <div>
                    {
                      (word.length > 25) ?
                        <Form fieldname={id} label={``} inputType='textarea' register={register} errors={errors} isRequired={true} />
                        :
                        <Form fieldname={id} label={``} inputType='text' register={register} errors={errors} isRequired={true} />
                    }
                  </div>
                  {/* } */}
                </div>
              ))}
            </form>


            <form onSubmit={handleSubmit(saveWords)}>
              {(word_type == 'appointment') && Object.entries(words.appointmentWords).map(([id, word]) => (
                <div className={styles.lang_header_wrap + " " + styles.content_wrap} style={{ display: (word.length > 25) && 'block' }}>

                  <div className={`${styles.words} ${(word.length > 25) && styles.max_content}`} key={id} >
                    <span>{word}</span>
                  </div>
                  {/* {language &&  */}
                  <div>
                    {
                      (word.length > 25) ?
                        <Form fieldname={id} label={``} inputType='textarea' register={register} errors={errors} isRequired={true} />
                        :
                        <Form fieldname={id} label={``} inputType='text' register={register} errors={errors} isRequired={true} />
                    }
                  </div>
                  {/* } */}
                </div>
              ))}
            </form>


            <form onSubmit={handleSubmit(saveWords)}>
              {(word_type == 'event') && Object.entries(words.eventWords).map(([id, word]) => (
                <div className={styles.lang_header_wrap + " " + styles.content_wrap} style={{ display: (word.length > 25) && 'block' }}>
                  <div className={`${styles.words} ${(word.length > 25) && styles.max_content}`} key={id} >
                    <span>{word}</span>
                  </div>
                  {/* {language &&  */}
                  <div>
                    {
                      (word.length > 25) ?
                        <Form fieldname={id} label={``} inputType='textarea' register={register} errors={errors} isRequired={true} />
                        :
                        <Form fieldname={id} label={``} inputType='text' register={register} errors={errors} isRequired={true} />
                    }
                  </div>
                  {/* } */}
                </div>
              ))}
            </form>


            <form onSubmit={handleSubmit(saveWords)}>
              {(word_type == 'booking') && Object.entries(words.bookingWords).map(([id, word]) => (
                <div className={styles.lang_header_wrap + " " + styles.content_wrap} style={{ display: (word.length > 25) && 'block' }}>
                  <div className={`${styles.words} ${(word.length > 25) && styles.max_content}`} key={id} >
                    <span>{word}</span>
                  </div>

                  <div>
                    {
                      language && (word.length > 25) ?
                        <Form fieldname={id} label={``} inputType='textarea' register={register} errors={errors} isRequired={true} />
                        :
                        <Form fieldname={id} label={``} inputType='text' register={register} errors={errors} isRequired={true} />
                    }
                  </div>
                  {/* {language && } */}
                </div>
              ))}

              <div className="text-right mt mb">
                <button type='submit' className="ap_btn">Save</button>
              </div>
            </form>
          </div>


        </div>


      </div >
    </div >
  )
}

export default LanguageSettings