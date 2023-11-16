import Login from "./login/index";
import Register from "./register/index";
import Company from "./company/index";
import Schedule from "./schedule/index";
import Index from "./"
import Users from "./users/[userDynamic]";

export default function Home() {
  return (
    <>
      <Users />
    </>
  );
}
