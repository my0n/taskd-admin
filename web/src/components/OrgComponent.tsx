import { Block, Box, Button, Container, Content, Notification, Table } from "react-bulma-components";
import { useResource } from "rest-hooks";
import { userList } from "../endpoints/userList";

export const OrgComponent = (props: { org: string }) => {
  const users = useResource(userList, { org: props.org });
  return (
    <Box>
      <Block>
        <Notification color="info">
          <Container alignContent="start">
            <Button color="danger">Delete</Button>
            <Button>New User</Button>
            <Content>{props.org}</Content>
          </Container>
        </Notification>
      </Block>
      <Table>
        <thead>
          <tr>
            <th>
            </th>
            <th>
            </th>
            <th>
            </th>
            <th>
              Name
            </th>
            <th>
              UUID
            </th>
          </tr>
        </thead>
        <tbody>
          {users.users.map(user => (
            <tr key={user.uuid}>
              <td>
                <Button color="danger">Delete</Button>
              </td>
              <td>
                <Button>Download cert.pem</Button>
              </td>
              <td>
                <Button>Download key.pem</Button>
              </td>
              <td>
                {user.name}
              </td>
              <td>
                {user.uuid}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
};