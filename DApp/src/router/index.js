import Vue from 'vue'
import Router from 'vue-router'

import OCMEnroll from "@/components/OCMEnroll";
import OCMSell from "@/components/OCMSell";
import ICDistributor1Sell from "@/components/ICDistributor1Sell";
import ICDistributor2Sell from "@/components/ICDistributor2Sell";
import PCBAssemblerSell from "@/components/PCBAssemblerSell";
import SystemDistributorSell from "@/components/SystemDistributorSell";
import SystemIntegratorVerification from "@/components/SystemIntegratorVerification";
import SystemIntegratorSell from "@/components/SystemIntegratorSell";
import PCBDistributorSell from "@/components/PCBDistributorSell";
import PCBAssemblerVerification from "@/components/PCBAssemblerVerification";
import OCMVerification from "@/components/OCMVerification";
import SystemIntegratorSearch from "@/components/SystemIntegratorSearch";
import SystemDistributorSearch from "@/components/SystemDistributorSearch";
import PCBDistributorSearch from "@/components/PCBDistributorSearch";
import PCBAssemblerSearch from "@/components/PCBAssemblerSearch";
import ICDistributor2Search from "@/components/ICDistributor2Search";
import ICDistributor1Search from "@/components/ICDistributor1Search";
import OCMSearch from "@/components/OCMSearch";

try {
Vue.use(Router)
}
catch(e) {
  console.error(e);
}

export default new Router({
  routes: [

    {
      path: '/OCMVerification',
      name: 'OCMVerification',
      component: OCMVerification
    },
    {
      path: '/OCMEnroll',
      name: 'OCMEnroll',
      component: OCMEnroll
    },
    {
      path: '/OCMSell',
      name: 'OCMSell',
      component: OCMSell
    },
    {
      path: '/ICDistributor1Sell',
      name: 'ICDistributor1Sell',
      component: ICDistributor1Sell
    },
    {
      path: '/ICDistributor2Sell',
      name: 'ICDistributor2Sell',
      component: ICDistributor2Sell
    },
    {
      path: '/PCBAssemblerVerification',
      name: 'PCBAssemblerVerification',
      component: PCBAssemblerVerification
    },
    {
      path: '/PCBAssemblerSell',
      name: 'PCBAssemblerSell',
      component: PCBAssemblerSell
    },
    {
      path: '/SystemDistributorSell',
      name: 'SystemDistributorSell',
      component: SystemDistributorSell
    },
    {
      path: '/SystemIntegratorVerification',
      name: 'SystemIntegratorVerification',
      component: SystemIntegratorVerification
    },
    {
      path: '/SystemIntegratorSell',
      name: 'SystemIntegratorSell',
      component: SystemIntegratorSell
    },
    {
      path: '/PCBDistributorSell',
      name: 'PCBDistributorSell',
      component: PCBDistributorSell
    },
    {
      path: '/SystemIntegratorSearch',
      name: 'SystemIntegratorSearch',
      component: SystemIntegratorSearch
    },
    {
      path: '/SystemDistributorSearch',
      name: 'SystemDistributorSearch',
      component: SystemDistributorSearch
    },
    {
      path: '/PCBDistributorSearch',
      name: 'PCBDistributorSearch',
      component: PCBDistributorSearch
    },
    {
      path: '/PCBAssemblerSearch',
      name: 'PCBAssemblerSearch',
      component: PCBAssemblerSearch
    },
    {
      path: '/ICDistributor2Search',
      name: 'ICDistributor2Search',
      component:  ICDistributor2Search
    },
    {
      path: '/ICDistributor1Search',
      name: 'ICDistributor1Search',
      component:  ICDistributor1Search
    },
    {
      path: '/OCMSearch',
      name: 'OCMSearch',
      component:  OCMSearch
    },


  ]

})
