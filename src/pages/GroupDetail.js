import React, { useEffect } from "react";
import { useState } from "react";
import NoMemberGroupDetail from "../components/NoMemberGroupDetail";
import MemberGroupDetal from "../components/MemberGroupDetail";
import FinishGroup from "./FinishGroup";
const GroupDetail = ({ route, navigation }) => {
  const { group } = route.params;

  useEffect(() => {
    console.log(group.members.length);
  });

  if (group.isAvailable !== false) {
    return (
      <>
        {group.members.length < 2 ? (
          <NoMemberGroupDetail group={group} navigation={navigation} />
        ) : (
          <MemberGroupDetal group={group} navigation={navigation} />
        )}
      </>
    );
  } else {
    return <FinishGroup group={group} navigation={navigation}></FinishGroup>;
  }
};

export default GroupDetail;
