import styles from './JournalForm.module.css';
import Button from '../Button/Button';
import Input from '../Input/Input';
import { useEffect, useReducer, useRef, useContext } from 'react';
import { INITIAL_STATE, formReducer } from './JournalForm.state';
import { UserContext } from '../../context/user.context';

function JournalForm({ onSubmit, onDelete, data }) {
  const [formState, dispatchForm] = useReducer(formReducer, INITIAL_STATE);
  const { isValid, isFormReadyToSubmit, values } = formState;
  const titleRef = useRef();
  const dateRef = useRef();
  const textRef = useRef();
  const { userId } = useContext(UserContext);

  const focusError = (isValid) => {
    switch (true) {
      case !isValid.title:
        titleRef.current.focus();
        break;
      case !isValid.date:
        dateRef.current.focus();
        break;
      case !isValid.text:
        textRef.current.focus();
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (!data) {
      dispatchForm({ type: 'CLEAR' });
      dispatchForm({ type: 'SET_VALUE', payload: { userId } });
    }
    dispatchForm({ type: 'SET_VALUE', payload: { ...data } });
  }, [data, userId]);

  useEffect(() => {
    let timerId;
    if (!isValid.date || !isValid.text || !isValid.title) {
      focusError(isValid);
      timerId = setTimeout(() => {
        // console.log('очистка состояния');
        dispatchForm({ type: 'RESET_VALIDITY' });
      }, 2000);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [isValid]);

  useEffect(() => {
    dispatchForm({ type: 'SET_VALUE', payload: { userId } });
  }, [userId]);

  useEffect(() => {
    if (isFormReadyToSubmit) {
      onSubmit(values);
      dispatchForm({ type: 'CLEAR' });
      dispatchForm({ type: 'SET_VALUE', payload: { userId } });
    }
  }, [isFormReadyToSubmit, onSubmit, values, userId]);

  const addJournalItem = (e) => {
    e.preventDefault();
    dispatchForm({ type: 'SUBMIT' });
  };

  const onChange = (e) => {
    dispatchForm({ type: 'SET_VALUE', payload: { [e.target.name]: e.target.value } });
  };

  const deleteJournalitem = () => {
    onDelete(data.id);
    dispatchForm({ type: 'CLEAR' });
    dispatchForm({ type: 'SET_VALUE', payload: { userId } });
  };

  return (
    <form className={styles['journal-form']} onSubmit={addJournalItem}>
      <div className={styles['input-row']}>
        <label htmlFor="date" className={styles['form-label']}></label>
        <Input
          type="text"
          name="title"
          value={values.title}
          ref={titleRef}
          onChange={onChange}
          isValid={isValid.title}
          appearence={'title'}
        />
        {data?.id && (
          <button className={styles['archive-button']} type="button" onClick={deleteJournalitem}>
            <img src="./archive.svg" alt="archive" />
          </button>
        )}
      </div>
      <div className={styles['input-row']}>
        <label htmlFor="date" className={styles['form-label']}>
          <img src="./calendar.svg" alt="date" />
          <span>Дата</span>
        </label>
        <Input
          type="date"
          value={values.date ? new Date(values.date).toISOString().slice(0, 10) : ''}
          ref={dateRef}
          name="date"
          id="date"
          isValid={isValid.date}
          onChange={onChange}
        />
      </div>
      <div className={styles['input-row']}>
        <label htmlFor="tag" className={styles['form-label']}>
          <img src="./folder.svg" alt="folder" />
          <span>Метки</span>
        </label>
        <Input type="text" value={values.tag} onChange={onChange} name="tag" id="tag" />
      </div>
      <div className={styles['input-row']}>
        <label
          htmlFor="tag"
          className={`${styles['form-label']} ${styles['textarea-form-label']} `}
        >
          <img src="./pencil.svg" alt="folder" />
          <span>Текст</span>
        </label>
        <textarea
          name="text"
          value={values.text}
          cols="30"
          rows="5"
          ref={textRef}
          onChange={onChange}
          className={` ${styles['input-textarea']} ${isValid.text ? '' : styles['invalid']}`}
        />
      </div>
      <div className={styles['button-container']}>
        <Button>Сохранить</Button>
      </div>
    </form>
  );
}

export default JournalForm;
