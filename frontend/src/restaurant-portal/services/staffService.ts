export const staffService = {
  getStaffMembers: async (_restaurantId: string): Promise<any[]> => {
    return Promise.resolve([]);
  },
  addStaffMember: async (member: any): Promise<any> => {
    return Promise.resolve(member);
  },
};
export default staffService;
