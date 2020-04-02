/* @flow */
import invariant from "invariant";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import React, { useCallback, useState, useMemo } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Trans } from "react-i18next";
import i18next from "i18next";

import * as Animatable from "react-native-animatable";

import type { NavigationScreenProp } from "react-navigation";
import type { Account } from "@ledgerhq/live-common/lib/types";
import type {
  Vote,
  Transaction,
} from "@ledgerhq/live-common/lib/families/tron/types";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import {
  useTronSuperRepresentatives,
  SR_MAX_VOTES,
  formatVotes,
} from "@ledgerhq/live-common/lib/families/tron/react";

import { accountAndParentScreenSelector } from "../../../reducers/accounts";
import colors from "../../../colors";
import { TrackScreen } from "../../../analytics";
import Button from "../../../components/Button";
import StepHeader from "../../../components/StepHeader";
import RetryButton from "../../../components/RetryButton";
import CancelButton from "../../../components/CancelButton";
import GenericErrorBottomModal from "../../../components/GenericErrorBottomModal";
import LText from "../../../components/LText";
import ArrowRight from "../../../icons/ArrowRight";

import VoteRow from "./02-VoteRow";
import VoteModal from "./02-VoteModal";
import Check from "../../../icons/Check";

const forceInset = { bottom: "always" };

type Props = {
  account: Account,
  navigation: NavigationScreenProp<{
    params: {
      accountId: string,
      transaction: Transaction,
    },
  }>,
};

const CastVote = ({ account, navigation }: Props) => {
  const bridge = getAccountBridge(account, undefined);

  const { tronResources } = account;
  invariant(tronResources, "tron resources required");
  const { tronPower } = tronResources;

  const {
    transaction,
    status,
    setTransaction,
    bridgeError,
    bridgePending,
  } = useBridgeTransaction(() => {
    const tx = navigation.getParam("transaction");

    if (!tx) {
      const t = bridge.createTransaction(account);
      const { votes } = tronResources;

      return {
        account,
        transaction: bridge.updateTransaction(t, {
          mode: "vote",
          votes,
        }),
      };
    }

    return { account, transaction: tx };
  });

  invariant(transaction, "transaction must be defined");
  invariant(transaction.family === "tron", "transaction tron");

  const { votes } = transaction;

  const sp = useTronSuperRepresentatives();

  const formattedVotes = useMemo(() => formatVotes(votes, sp), [sp, votes]);

  const votesRemaining = useMemo(
    () => tronPower - votes.reduce((sum, { voteCount }) => sum + voteCount, 0),
    [tronPower, votes],
  );

  const [editVote, setEditVote] = useState();

  const closeEditVote = useCallback(() => setEditVote(null), [setEditVote]);

  const onChange = useCallback(
    (vote: Vote) => {
      const nextVotes = [...votes];
      const index = votes.findIndex(v => v.address === vote.address);

      if (index >= 0) nextVotes[index] = vote;
      else if (nextVotes.length < 5) nextVotes.push(vote);
      setTransaction(
        bridge.updateTransaction(transaction, {
          votes: nextVotes,
        }),
      );
      closeEditVote();
    },
    [votes, setTransaction, bridge, transaction, closeEditVote],
  );

  const openEditModal = useCallback(
    (vote: Vote, name: string) => {
      setEditVote({ vote, name });
    },
    [setEditVote],
  );

  const onRemove = useCallback(
    (vote: Vote) => {
      setTransaction(
        bridge.updateTransaction(transaction, {
          votes: votes.filter(v => v.address !== vote.address),
        }),
      );
      closeEditVote();
    },
    [votes, setTransaction, bridge, transaction, closeEditVote],
  );

  const onBack = useCallback(() => {
    // $FlowFixMe
    navigation.replace("VoteSelectValidator", {
      accountId: account.id,
      transaction,
      status,
    });
  }, [account, navigation, transaction, status]);

  const onContinue = useCallback(() => {
    navigation.navigate("VoteConnectDevice", {
      accountId: account.id,
      transaction,
      status,
    });
  }, [account, navigation, transaction, status]);

  const onBridgeErrorCancel = useCallback(() => {
    const parent = navigation.dangerouslyGetParent();
    if (parent) parent.goBack();
  }, [navigation]);

  const onBridgeErrorRetry = useCallback(() => {
    if (!transaction) return;
    setTransaction(bridge.updateTransaction(transaction, {}));
  }, [setTransaction, transaction, bridge]);

  if (!account || !transaction) return null;

  const error = bridgePending ? null : status.errors.vote;

  return (
    <>
      <TrackScreen category="Vote" name="CastVote" />
      <SafeAreaView style={styles.root} forceInset={forceInset}>
        <ScrollView style={[styles.root]}>
          {formattedVotes.map((vote, i) => (
            <VoteRow
              key={vote.address + i}
              vote={vote}
              onEdit={openEditModal}
              onRemove={onRemove}
              index={i}
            />
          ))}
          {votes.length < SR_MAX_VOTES ? (
            <Animatable.View
              animation="slideInLeft"
              duration={400}
              useNativeDriver
              style={styles.addMoreVotesContainer}
            >
              <TouchableOpacity onPress={onBack} style={styles.addMoreVotes}>
                <LText semiBold style={styles.addMoreVotesLabel}>
                  <Trans i18nKey="vote.castVotes.addMoreVotes" />
                </LText>
                <ArrowRight size={16} color={colors.live} />
              </TouchableOpacity>
            </Animatable.View>
          ) : null}
        </ScrollView>
        <View style={styles.bottomWrapper}>
          <View style={styles.available}>
            {votesRemaining <= 0 ? (
              <>
                <Check size={16} color={colors.success} />
                <LText
                  semiBold
                  style={[styles.availableAmount, styles.votesSuccess]}
                >
                  <Trans i18nKey="vote.castVotes.allVotesUsed" />
                </LText>
              </>
            ) : (
              <LText style={styles.availableAmount}>
                <Trans
                  i18nKey="vote.castVotes.votesRemaining"
                  values={{ total: votesRemaining }}
                >
                  <LText semiBold style={styles.availableAmount}>
                    text
                  </LText>
                </Trans>
              </LText>
            )}
          </View>
          <View style={styles.continueWrapper}>
            <Button
              event="CastVoteContinue"
              type="primary"
              title={<Trans i18nKey="common.continue" />}
              onPress={onContinue}
              disabled={!!error}
              pending={bridgePending}
            />
          </View>
        </View>
      </SafeAreaView>

      {editVote ? (
        <VoteModal
          vote={editVote.vote}
          name={editVote.name}
          tronPower={tronPower}
          votes={votes}
          onChange={onChange}
          onRemove={onRemove}
          onClose={closeEditVote}
        />
      ) : null}

      <GenericErrorBottomModal
        error={bridgeError}
        onClose={onBridgeErrorRetry}
        footerButtons={
          <>
            <CancelButton
              containerStyle={styles.button}
              onPress={onBridgeErrorCancel}
            />
            <RetryButton
              containerStyle={[styles.button, styles.buttonRight]}
              onPress={onBridgeErrorRetry}
            />
          </>
        }
      />
    </>
  );
};

CastVote.navigationOptions = {
  headerTitle: (
    <StepHeader
      title={i18next.t("vote.stepperHeader.castVote")}
      subtitle={i18next.t("vote.stepperHeader.stepRange", {
        currentStep: "2",
        totalSteps: "4",
      })}
    />
  ),
  headerLeft: null,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  topContainer: { paddingHorizontal: 32 },
  bottomWrapper: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.lightGrey,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  buttonRight: {
    marginLeft: 8,
  },
  continueWrapper: {
    alignSelf: "stretch",
    alignItems: "stretch",
    justifyContent: "flex-end",
  },
  available: {
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    fontSize: 16,
    paddingVertical: 8,
    color: colors.grey,
    marginBottom: 8,
  },
  availableAmount: {
    color: colors.darkBlue,
    marginHorizontal: 3,
  },
  addMoreVotesContainer: { paddingHorizontal: 16 },
  addMoreVotes: {
    width: "100%",
    padding: 16,
    borderRadius: 4,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  addMoreVotesLabel: { color: colors.live, fontSize: 16 },
  votesSuccess: { color: colors.success, marginLeft: 10 },
});

export default connect(accountAndParentScreenSelector)(CastVote);
