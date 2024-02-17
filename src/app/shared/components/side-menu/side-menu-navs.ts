export interface INav {
  title: string;
  path?: string;
  icon: string;
  type?: 'main' | 'additional'
}

export const sideMenuNavs: INav[] = [
  {
    title: 'Главная страница',
    path: 'home',
    icon: 'assets/icons/navs/home.svg',
    type: 'main'
  },
  {
    title: 'Управление задачами',
    path: 'tasks',
    icon: 'assets/icons/navs/tick-square.svg',
    type: 'main'
  },
  {
    title: 'Календарь',
    path: 'calendar',
    icon: 'assets/icons/navs/calendar.svg',
    type: 'main'
  },
  {
    title: 'Команда',
    path: 'team',
    icon: 'assets/icons/navs/team.svg',
    type: 'main'
  },
  {
    title: 'Статистика',
    path: 'activity',
    icon: 'assets/icons/navs/activity.svg',
    type: 'main'
  },
  {
    title: 'Профиль',
    path: 'profile',
    icon: 'assets/icons/navs/profile.svg',
    type: 'main'
  },
  {
    title: 'Настройки',
    path: 'settings',
    icon: 'assets/icons/navs/settings.svg',
    type: 'additional'
  },
];
