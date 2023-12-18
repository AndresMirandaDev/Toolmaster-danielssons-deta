const request = require('supertest');
const mongoose = require('mongoose');
const { Project } = require('../../../models/project');
const { User } = require('../../../models/user');
let server;

describe('/api/projects', () => {
  beforeEach(() => {
    server = require('../../../index');
  });

  afterEach(async () => {
    await server.close();
    await Project.remove({});
    await User.remove({});
  });

  describe('GET /', () => {
    let token;

    it('should return 401 if no token is provided', async () => {
      const res = await request(server).get('/api/projects');

      expect(res.status).toBe(401);
    });

    it('should return all projects', async () => {
      token = new User().generateAuthToken();
      const userId = new mongoose.Types.ObjectId();

      await User.collection.insertMany([
        {
          name: 'user1',
          phone: 12345,
          email: 'somemail@gmail.com',
          password: '123456',
          _id: userId,
        },
      ]);
      await Project.collection.insertMany([
        {
          name: 'project 1',
          projectNumber: 123456,
          address: 'address some place 1',
          supervisor: userId,
          startDate: new Date(),
          endDate: new Date(),
        },
        {
          name: 'project 2',
          projectNumber: 7891011,
          address: 'address some place 2',
          supervisor: userId,
          startDate: new Date(),
          endDate: new Date(),
        },
      ]);
      const res = await request(server)
        .get('/api/projects')
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((p) => p.name === 'project 1')).toBeTruthy();
      expect(res.body.some((p) => p.name === 'project 2')).toBeTruthy();
      expect(res.body.some((p) => p.supervisor.name === 'user1')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    let token;
    let userId = new mongoose.Types.ObjectId();
    let projectId = new mongoose.Types.ObjectId();

    const exec = async () => {
      return await request(server)
        .get(`/api/projects/${projectId}`)
        .set('x-auth-token', token);
    };

    beforeEach(async () => {
      token = new User().generateAuthToken();
      await User.collection.insertMany([
        {
          name: 'user1',
          phone: 12345,
          email: 'somemail@gmail.com',
          password: '123456',
          _id: userId,
        },
      ]);
      await Project.collection.insertMany([
        {
          _id: projectId,
          name: 'project 1',
          projectNumber: 123456,
          address: 'address some place 1',
          supervisor: userId,
          startDate: new Date(),
          endDate: new Date(),
        },
      ]);
    });

    afterEach(async () => {
      await User.remove({});
      await Project.remove({});
    });

    it('should return 401 if no token is provided', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if id is invalid', async () => {
      projectId = 'a';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if id is valid but no project is found', async () => {
      projectId = new mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('return the project if token and id are valid and given id is found', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.name === 'project 1').toBeTruthy();
    });
  });

  describe('POST /', () => {
    let token;
    let userId = new mongoose.Types.ObjectId();
    let name;
    let projectNumber;
    let address;
    let supervisor;
    let startDate;
    let endDate;

    const exec = async () => {
      return await request(server)
        .post('/api/projects')
        .set('x-auth-token', token)
        .send({
          name,
          projectNumber,
          address,
          supervisor,
          startDate,
          endDate,
        });
    };

    beforeEach(async () => {
      (name = 'project 1'),
        (projectNumber = 12345),
        (address = 'some address 1');
      supervisor = userId;
      startDate = new Date();
      endDate = new Date();

      token = new User({ isAdmin: true }).generateAuthToken();
      await User.collection.insertMany([
        {
          name: 'user1',
          phone: 12345,
          email: 'somemail@gmail.com',
          password: '123456',
          _id: userId,
        },
      ]);
    });

    it('should return 401 if no token is provided.', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
      token = 'a';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 403 if user is not admin', async () => {
      token = new User({ isAdmin: false }).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 400 if name is less than 5 characters.', async () => {
      name = '1234';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is more than 50 characters long', async () => {
      name = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if address is less than 5 characters.', async () => {
      address = '1234';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if address is more than 50 characters long.', async () => {
      address = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if project number is not a number.', async () => {
      projectNumber = '';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if supervisor is not a valid objectId.', async () => {
      supervisor = 'a';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if start date is not a date.', async () => {
      startDate = 'a';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if end date is not a date.', async () => {
      endDate = 'a';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if supervisor is a valid object id but no user with the given id exists.', async () => {
      supervisor = new mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 200 and the new project if everything is valid and new project was created', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('address');
      expect(res.body).toHaveProperty('supervisor');
      expect(res.body).toHaveProperty('startDate');
      expect(res.body).toHaveProperty('endDate');
      expect(res.body).toHaveProperty('projectNumber');
    });
  });

  describe('PUT /:id', () => {
    let token;
    let userId = new mongoose.Types.ObjectId();
    let name;
    let projectNumber;
    let address;
    let supervisor;
    let startDate;
    let endDate;
    let projectId = new mongoose.Types.ObjectId();

    const exec = async () => {
      return await request(server)
        .put(`/api/projects/${projectId}`)
        .set('x-auth-token', token)
        .send({
          name,
          projectNumber,
          address,
          supervisor,
          startDate,
          endDate,
        });
    };

    beforeEach(async () => {
      (name = 'project 1'),
        (projectNumber = 12345),
        (address = 'some address 1');
      supervisor = userId;
      startDate = new Date();
      endDate = new Date();

      token = new User({ isAdmin: true }).generateAuthToken();
      await User.collection.insertMany([
        {
          name: 'user1',
          phone: 12345,
          email: 'somemail@gmail.com',
          password: '123456',
          _id: userId,
        },
      ]);

      await Project.collection.insertMany([
        {
          _id: projectId,
          name,
          projectNumber,
          address,
          supervisor,
          startDate,
          endDate,
        },
      ]);
    });

    it('should return 401 if no token is provided', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 401 if no token is provided.', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid.', async () => {
      token = 'a';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 403 if user is not admin.', async () => {
      token = new User({ isAdmin: false }).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });
  });
});
