import {createRouter, createWebHistory} from "vue-router"

import {
    ResidentialBuyPage,
    ResidentialLongRentPage,
    ResidentialDailyRentPage,
    CommerceBuyPage,
    CommerceRentPage,
} from "@/pages/services/index.js"

import AuthPage from "@/pages/AuthPage.vue"
import RegistrationPage from "@/pages/RegistrationPage.vue"
import UserPage from "@/pages/UserPage.vue"

import EstateItemPage from "@/pages/EstateItemPage.vue"
import error404 from "@/pages/errors/404.vue"


const routes = [
    {
        path: "/",
        redirect: "/residential/buy"
    },
    {
        path: "/residential/buy",
        component: ResidentialBuyPage
    },
    {
        path: "/residential/long-rent",
        component: ResidentialLongRentPage
    },
    {
        path: "/residential/daily-rent",
        component: ResidentialDailyRentPage
    },
    {
        path: "/commerce/buy",
        component: CommerceBuyPage
    },
    {
        path: "/commerce/rent",
        component: CommerceRentPage
    },
    {
        path: "/auth",
        component: AuthPage
    },
    {
        path: "/registration",
        component: RegistrationPage
    },
    {
        path: "/personal-acc",
        component: UserPage,
    },
    {
        path: "/:catchAll(.*)/estate-item/:id",
        component: EstateItemPage,
    },
    {
        path: "/:catchAll(.*)",
        component: error404
    },
]

const router = createRouter({
    routes: routes,
    history: createWebHistory()
    // названия параметров обязательно!
})

export default router;