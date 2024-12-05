import { IRole } from "../types/IRole";

export const EMPLOYEE_ROLE = "employee"
export const ADMIN_ROLE = "admin"
export const MANAGER_ROLE = "manager"
export const DEFAULT_ROLE = EMPLOYEE_ROLE


const ROLES: IRole[] = [
  {
    name: ADMIN_ROLE,
    level: 0,
    permissions: [
      "create_record",
      "read_record",
      "update_record",
      "delete_record"
    ]
  },
  {
    name: MANAGER_ROLE,
    level: 1,
    permissions: ["create_record", "read_record", "update_record"]
  },
  {
    name: EMPLOYEE_ROLE,
    level: 2,
    permissions: ["create_record", "read_record"]
  }
];

export const RoleRepository = Object.freeze({
  getRoleByName(name: string) {
    return ROLES.find(role => role.name === name);
  },

  getRoles() {
    return ROLES;
  },
  getPermissionsByRoleName(roleName: string) {
    const role = ROLES.find(r => r.name === roleName);
    return role ? role.permissions : [];
  },
  getRoleLevelByRoleName(roleName: string) {
    const role = ROLES.find(r => r.name === roleName);
    return role ? role.level : 9999;
  }
});
