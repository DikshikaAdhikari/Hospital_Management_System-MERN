import Department from "./department.model.js";

export const createDepartmentService = async (data) => {
  const checkDepartment = await Department.findOne({
    where: { name: data.name },
  });

  if (checkDepartment) {
    throw new Error("Department already exists");
  }

  return await Department.create(data);
};

export const getAllDepartmentsService = async () => {
  return await Department.findAll();
};

export const getDepartmentByIdService = async (id) => {
  const department = await Department.findByPk(id);

  if (!department) {
    throw new Error("Department not found");
  }

  return department;
};

export const updateDepartmentService = async (id, data) => {
  const department = await Department.findByPk(id);

  if (!department) {
    throw new Error("Department not found");
  }

  await department.update(data);

  return department;
};

export const deleteDepartmentService = async (id) => {
  const department = await Department.findByPk(id);

  if (!department) {
    throw new Error("Department not found");
  }

  await department.destroy();

  return true;
};