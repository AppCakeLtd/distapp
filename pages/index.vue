<template>
    <div>
        <div class="flex flex-col sm:flex-row sm:mt-5 gap-2">
            <div class="flex flex-col gap-3 px-5 py-5 sm:p-20 justify-center items-start flex-1">
                <span class="text-4xl font-medium">DistApp</span>
                <span class="text-lg font-light">Manage and distribute your Enterprise Apps.
                    Useful for tester or self distribution.
                    Alternative App Center Distribution.</span>
                <div class="flex flex-row flex-wrap gap-4 mt-3">
                    <NuxtLink to="https://github.com/yunusefendi52/distapp" target="_blank">
                        <Button icon="pi pi-github" label="GitHub" severity="secondary" />
                    </NuxtLink>
                    <NuxtLink :to="{
                        name: isLoggedIn ? 'apps' : 'signin',
                    }">
                        <Button :label="isLoggedIn ? 'Go To Apps' : 'Get Started'" />
                    </NuxtLink>
                </div>
                <span class="text-sm italic font-light">Beta testing</span>
            </div>
            <div class="flex justify-center items-center flex-1 p-5 sm:p-0 sm:mr-10">
                <img class="distapp-dark border border-white/15 rounded-lg" src="/assets/distapp-dark.webp">
                <img class="distapp-light border border-black/15 rounded-lg" src="/assets/distapp-light.webp">
            </div>
        </div>
    </div>
</template>

<style scoped lang="css">
.distapp-dark {
    display: none;
}

.appdark .distapp-dark {
    display: unset;
}

.distapp-light {
    display: none;
}

.applight .distapp-light {
    display: unset;
}
</style>

<script setup lang="ts">
import _ from 'lodash';
import { UserTokenInfo } from '~/server/models/UserTokenInfo';
import { userTokensKey } from '~/server/utils/utils';

definePageMeta({
    layout: 'content-layout',
})

const title = 'DistApp • Manage and distribute Enterprise Apps'
useHead({
    title: title,
})

const route = useRoute()
const router = useRouter()
const cookie = useCookie(cookieAuthKey)
const isLoggedIn = computed(() => cookie.value ? true : false)
if (isLoggedIn.value) {
    if (import.meta.client) {
        const userToken = route.query.usr?.toString()
        const userEmail = route.query.e?.toString()
        const userTokens = useLocalStorage<UserTokenInfo[]>(userTokensKey, [])
        router.push({
            query: {
            },
        })
        if (userToken && userEmail) {
            const newUserTokens = _.uniqBy([
                ...userTokens.value,
                {
                    email: userEmail,
                    token: userToken,
                },
            ], e => e.email)
            userTokens.value = newUserTokens
        }
    }
}
</script>