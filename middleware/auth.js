export default function ({store, route, redirect}) {
  if (route.path !== '/login' && !(/\/signup\/*/g.test(route.path))) {
    if (route.path === '/profile') {
      if (!store.getters['gambler/isSign'] && !store.getters['gambler/isAuth']) {
        redirect('/login')
      }
    } else if (!store.getters['gambler/isAuth']) {
      redirect('/login')
    } else if (route.path === '/') {
      redirect('/chat')
    }
  }
}
