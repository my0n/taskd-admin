import fetch from "node-fetch";

const baseUrl = "http://127.0.0.1:8080";

const getOrgList = async () => {
  return await fetch(`${baseUrl}/orgs`, {
    method: "GET"
  }).then(r => r.json());
};

const getUserList = async (org: string) => {
  return await fetch(`${baseUrl}/orgs/${org}/users`, {
    method: "GET"
  }).then(r => r.json());
};

const getCaCertPem = async () => {
  return await fetch(`${baseUrl}/ca.cert.pem`, {
    method: "GET"
  }).then(r => r.text());
};

const getUserCertPem = async (org: string, uuid: string) => {
  return await fetch(`${baseUrl}/orgs/${org}/users/${uuid}/cert.pem`, {
    method: "GET"
  }).then(r => r.text());
};

const getUserKeyPem = async (org: string, uuid: string) => {
  return await fetch(`${baseUrl}/orgs/${org}/users/${uuid}/key.pem`, {
    method: "GET"
  }).then(r => r.text());
};

const createOrg = async (name: string) => {
  return await fetch(`${baseUrl}/orgs`, {
    method: "POST",
    body: JSON.stringify({ name }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(r => r.json());
};

const createUser = async (org: string, name: string) => {
  return await fetch(`${baseUrl}/orgs/${org}/users`, {
    method: "POST",
    body: JSON.stringify({ name }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(r => r.json());
};

describe("primary test suite", () => {
  // get server credentials
  test("get the ca.cert.pem", async () => {
    const certPem = await getCaCertPem();
    expect(certPem).toContain("-----BEGIN CERTIFICATE-----");
    expect(certPem).toContain("-----END CERTIFICATE-----");
  });

  // preconditions
  test("empty org list at the start", async () => {
    const orgs = await getOrgList();
    expect(orgs).toEqual({
      statusCode: 200,
      orgs: []
    });
  });

  // basic org tests
  test("creates new org 'Bro'", async () => {
    const org = await createOrg("Bro");
    expect(org).toEqual({
      statusCode: 200,
      org: {
        name: "Bro"
      }
    });
  });
  test("new org 'Bro' in org list", async () => {
    const orgs = await getOrgList();
    expect(orgs).toEqual({
      statusCode: 200,
      orgs: [{
        name: "Bro"
      }]
    });
  });
  test("fails to create org 'Very cool org' with invalid name", async () => {
    const org = await createOrg("Very cool org");
    expect(org).toEqual({
      statusCode: 400,
      error: "Bad Request",
      message: `org 'Very cool org' is not a valid org name`
    });
  });
  test("fails to create org 'Bro' with existing name", async () => {
    const org = await createOrg("Bro");
    expect(org).toEqual({
      statusCode: 400,
      error: "Bad Request",
      message: `org 'Bro' already exists`
    });
  });
  test("org list is unchanged since last time", async () => {
    const orgs = await getOrgList();
    expect(orgs).toEqual({
      statusCode: 200,
      orgs: [{
        name: "Bro"
      }]
    });
  });
  test("creates another org 'Bro2'", async () => {
    const org = await createOrg("Bro2");
    expect(org).toEqual({
      statusCode: 200,
      org: {
        name: "Bro2"
      }
    });
  });
  test("both orgs 'Bro' and 'Bro2' are in the org list", async () => {
    const orgs = await getOrgList();
    expect(orgs).toEqual({
      statusCode: 200,
      orgs: [{
        name: "Bro"
      }, {
        name: "Bro2"
      }]
    });
  });

  // basic user tests
  test("user list is empty for org 'Bro'", async () => {
    const users = await getUserList("Bro");
    expect(users).toEqual({
      statusCode: 200,
      users: []
    });
  });
  test("user list not found for non-existent org 'Brotopia'", async () => {
    const users = await getUserList("Brotopia");
    expect(users).toEqual({
      statusCode: 404,
      error: "Not Found",
      message: "org 'Brotopia' does not exist"
    });
  });
  test("user list not found for failed org 'Very cool org'", async () => {
    const users = await getUserList("Very cool org");
    expect(users).toEqual({
      statusCode: 404,
      error: "Not Found",
      message: "org 'Very cool org' does not exist"
    });
  });
  test("creates user 'Radical' for org 'Bro'", async () => {
    const user = await createUser("Bro", "Radical");
    expect(user.statusCode).toEqual(200);
    expect(user.user.name).toEqual("Radical");
    expect(user.user.org).toEqual("Bro");
  });
  test("new user 'Radical' is in user list for org 'Bro'", async () => {
    const users = await getUserList("Bro");
    expect(users.statusCode).toEqual(200);
    expect(users.users).toHaveLength(1);
    expect(users.users[0].name).toEqual("Radical");
    expect(users.users[0].org).toEqual("Bro");
  });
  test("creates another second user called 'Radical' for org 'Bro'", async () => {
    const user = await createUser("Bro", "Radical");
    expect(user.statusCode).toEqual(200);
    expect(user.user.name).toEqual("Radical");
    expect(user.user.org).toEqual("Bro");
  });
  test("both 'Radical' users are in user list for org 'Bro'", async () => {
    const users = await getUserList("Bro");
    expect(users.statusCode).toEqual(200);
    expect(users.users).toHaveLength(2);
    expect(users.users[0].uuid).not.toEqual(users.users[1].uuid);
    expect(users.users[0].name).toEqual("Radical");
    expect(users.users[0].org).toEqual("Bro");
    expect(users.users[1].name).toEqual("Radical");
    expect(users.users[1].org).toEqual("Bro");
  });
  test("no users are in user list for org 'Bro2'", async () => {
    const users = await getUserList("Bro2");
    expect(users).toEqual({
      statusCode: 200,
      users: []
    });
  });
  test("fails to create user 'MyUserName' for org 'Bro3'", async () => {
    const user = await createUser("Bro3", "MyUserName");
    expect(user).toEqual({
      statusCode: 404,
      error: "Not Found",
      message: "org 'Bro3' does not exist"
    });
  });
  test("fails to create user 'MyUserName' for org 'Very cool org'", async () => {
    const user = await createUser("Very cool org", "MyUserName");
    expect(user).toEqual({
      statusCode: 404,
      error: "Not Found",
      message: "org 'Very cool org' does not exist"
    });
  });
  test("fails to create user 'My Epic Username' for org 'Bro2'", async () => {
    const user = await createUser("Bro2", "My Epic Username");
    expect(user).toEqual({
      statusCode: 400,
      error: "Bad Request",
      message: "name 'My Epic Username' is not a valid username"
    });
  });
  test("user list for org 'Bro2' is still empty", async () => {
    const users = await getUserList("Bro2");
    expect(users).toEqual({
      statusCode: 200,
      users: []
    });
  });

  // get user credentials
  test("get the cert.pem for the first user in the org 'Bro'", async () => {
    const users = await getUserList("Bro");
    const uuid = users.users[0].uuid;
    const certPem = await getUserCertPem("Bro", uuid);
    expect(certPem).toContain("-----BEGIN CERTIFICATE-----");
    expect(certPem).toContain("-----END CERTIFICATE-----");
  });
  test("get the key.pem for the first user in the org 'Bro'", async () => {
    const users = await getUserList("Bro");
    const uuid = users.users[0].uuid;
    const keyPem = await getUserKeyPem("Bro", uuid);
    expect(keyPem).toContain("-----BEGIN RSA PRIVATE KEY-----");
    expect(keyPem).toContain("-----END RSA PRIVATE KEY-----");
  });
});
