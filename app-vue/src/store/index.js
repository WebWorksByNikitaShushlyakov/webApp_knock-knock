// Создание хранилища, регистрация модулей
import { createStore } from 'vuex'
import mainStore from './modules/mainStore';
import configuration from './modules/configuration';

const store = createStore({
  modules:{mainStore, configuration}
});

export default store;