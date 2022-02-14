import { Container } from "react-bulma-components";
import { useResource } from "rest-hooks";
import { orgList } from "../endpoints/orgList";
import { OrgComponent } from "./OrgComponent";

export const OrgList = () => {
  const orgs = useResource(orgList, {});
  return (
    <Container>
      {orgs.orgs.map(org =>
        <OrgComponent
          org={org.name}
          key={org.name}
        />)}
    </Container>
  );
};