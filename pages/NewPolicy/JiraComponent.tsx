import { useEffect } from "react";
import CustomInput from "../../components/CustomInput/CustomInput";

interface JiraComponentProps {
  jiraId: string;
  jiraDescription: string;
  fieldError: boolean;
  setJiraId: (id: string) => void;
  setJiraDescription: (desc: string) => void;
  existingJiraIds: any[];
  setJiraIdExist?: (exists: boolean) => void; // Optional
}

const JiraComponent: React.FC<JiraComponentProps> = ({
  jiraId = "",
  jiraDescription = "",
  fieldError,
  setJiraId,
  setJiraDescription,
  existingJiraIds,
  setJiraIdExist, // Optional
}) => {

  const checkJiraExists = () => {
    return existingJiraIds.some((id) => id === jiraId);
  };

  useEffect(() => {
    if (jiraId.length !== 0 && setJiraIdExist) {
      setJiraIdExist(checkJiraExists());
    }
  }, [jiraId, existingJiraIds, setJiraIdExist]);

  const handleJiraIdInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJiraId(event.target.value.trim());
  };

  const handleJiraDescInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJiraDescription(event.target.value.trim());
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ width: "75%" }}>
        <CustomInput
          type="text"
          labelText="Jira ID"
          variant="outlined"
          error={!jiraId && fieldError}
          value={jiraId}
          showStarIcon={true}
          onChange={handleJiraIdInput}
          aria-autocomplete="list"
          aria-controls="autocomplete-list"
        />
        {checkJiraExists() && jiraId ? (
          <small style={{ color: "red" }}>Jira ID already exists</small>
        ):undefined}
      </div>
      <div style={{ width: "75%" }}>
        <CustomInput
          type="text"
          labelText="Jira Description"
          variant="outlined"
          showStarIcon={true}
          error={!jiraDescription && fieldError}
          value={jiraDescription}
          onChange={handleJiraDescInput}
          aria-autocomplete="list"
          aria-controls="autocomplete-list"
        />
      </div>
    </div>
  );
};

export default JiraComponent;
