import React, {
  FunctionComponent, useState, useCallback, useEffect,
} from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useHistory } from 'react-router-dom';

import {
  Input, Button, FormControl, Select, MenuItem, InputLabel, TextField,
} from '@material-ui/core';

import { AppToastMemo } from '../AppToast/AppToast';

import { RootState } from '../../types/types';

import {
  EDIRTASK, STATUSES, BUTTONCANCEL, BUTTONEDIT, TEXTOFDISABLE,
} from '../../constants';

import { editTodo } from '../../store/actions/actions';

import { handleClickNotify } from '../AppToast';

import styles from './style.module.scss';

export const EditTodo: FunctionComponent = (): JSX.Element => {
  const history = useHistory();

  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state?.todosReducers);

  const indexOfTodo: number = tasks?.findIndex((task) => task.edited === true);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    setTitle(tasks[indexOfTodo]?.title);
    setDescription(tasks[indexOfTodo]?.description);
    setStatus(tasks[indexOfTodo]?.status);
  }, [indexOfTodo, tasks]);

  const handleClickEditTask = useCallback(() => {
    dispatch(editTodo(title, description, status));

    history.push('/');
  }, [description, status, tasks, title]);

  const handleClickCancel = useCallback(() => {
    history.push('/');
  }, [history]);

  const handleChangeSelect = useCallback((e: React.ChangeEvent<{ value: unknown }>) => {
    const optionName = e.target.value;
    const currentStatus = tasks[indexOfTodo]?.status;
    if (currentStatus === 'ToDo' && optionName === 'InProgress') {
      setStatus(optionName);
    } else if (currentStatus === 'InProgress' && (optionName === 'inQA' || optionName === 'Blocked')) {
      setStatus(optionName as string);
    } else if (currentStatus === 'inQA' && (optionName === 'Done' || 'ToDo')) {
      setStatus(optionName as string);
    } else if (currentStatus === 'Done' && optionName === 'Deployed') {
      setStatus(optionName);
    } else if (currentStatus === 'Blocked' && optionName === 'ToDo') {
      setStatus(optionName as string);
    } else {
      handleClickNotify(TEXTOFDISABLE);
    }
  }, [indexOfTodo, tasks]);

  return (
    <div className={styles.container}>
      <AppToastMemo />
      <div className={styles.containerCard}>
        <span className={styles.heading}>{EDIRTASK}</span>
        <Input
          placeholder="Title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          fullWidth
          color="primary"
          className={styles.titleCard}
        />
        <TextField
          label="Description"
          variant="outlined"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          fullWidth
          className={styles.descriptionCard}
          multiline
          minRows={6}
          maxRows={6}
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            value={status}
            onChange={handleChangeSelect}
          >
            {STATUSES.map((item) => {
              return <MenuItem value={item} key={item}>{item}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <div className={styles.containerBtn}>
          <Button variant="outlined" type="submit" className={styles.btnSucces} onClick={handleClickEditTask}>{BUTTONEDIT}</Button>
          <Button variant="outlined" className={styles.btnError} onClick={handleClickCancel}>{BUTTONCANCEL}</Button>
        </div>
      </div>
    </div>
  );
};
