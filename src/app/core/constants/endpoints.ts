export const API = 'assets/mock';

export enum GatewaysEnum {
  Auth = 'auth',
  Users = 'users',
  Tasks = 'tasks',
}

export const ENDPOINTS: Record<GatewaysEnum, { [key: string]: string }> = {
  auth: {
    login: 'users',
    logout: 'users',
  },
  users: {
    getUserList: 'users',
    getUserInfo: 'users',
  },
  tasks: {
    getTask: 'tasks',
    getTaskList: 'tasks',
    createTask: 'tasks',
    deleteTask: 'tasks',
  },
} as const;
