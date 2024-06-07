import { Characters } from '@/constants/characters';
import api from '../api';
import { AxiosResponse } from 'axios';

export const getCharacters = async (name: string, page: number): Promise<AxiosResponse<Characters>> => {
  return await api.get(`/api/character/?name=${name}&page=${page}`);
};
