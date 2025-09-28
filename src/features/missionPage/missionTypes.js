export const missionTypeDetails = {
  MANUAL_URL: {
    // Maps the 'MANUAL_URL' type to the 'getUrlMission' function in mission.service.js
    service: 'getUrlMission',
    // Maps the 'MANUAL_URL' type to the 'updateUrlMission' function for editing
    updateService: 'updateUrlMission',
  },
  QR_CODE: {
    service: 'getQrMission',
    updateService: 'updateQrMission',
  },
  // EXAMPLE for a future type:
  // SOME_OTHER_TYPE: {
  //   service: 'getSomeOtherTypeMission',
  // },
};
