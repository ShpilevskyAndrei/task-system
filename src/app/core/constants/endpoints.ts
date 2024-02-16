export const API = 'assets/mock';

export enum GatewaysEnum {
  Auth = 'auth',
  Users = 'users',
  Tasks = 'tasks',
}

export const ENDPOINTS: Record<GatewaysEnum, { [key: string]: string }> = {
  auth: {
    login: 'users.json',
    logout: 'users.json',
  },
  users: {
    getUserList: 'users.json',
    getUserInfo: 'users.json',
  },
  tasks: {
    getTask: 'tasks.json',
    getTaskList: 'tasks.json',
    createTask: 'tasks.json',
    deleteTask: 'tasks.json',
  },
} as const;
