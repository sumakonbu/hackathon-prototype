/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface VerificationContractTokenInterface extends ethers.utils.Interface {
  functions: {
    "contractAddresses(uint256)": FunctionFragment;
    "contractTokenIds(address)": FunctionFragment;
    "contractTokens(uint256)": FunctionFragment;
    "create(address,string,bool)": FunctionFragment;
    "list()": FunctionFragment;
    "modify(address,bool)": FunctionFragment;
    "purge()": FunctionFragment;
    "setMainContractAddress(address)": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "verify(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "contractAddresses",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "contractTokenIds",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "contractTokens",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "create",
    values: [string, string, boolean]
  ): string;
  encodeFunctionData(functionFragment: "list", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "modify",
    values: [string, boolean]
  ): string;
  encodeFunctionData(functionFragment: "purge", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setMainContractAddress",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "verify", values: [string]): string;

  decodeFunctionResult(
    functionFragment: "contractAddresses",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "contractTokenIds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "contractTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "create", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "list", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "modify", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "purge", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setMainContractAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "verify", data: BytesLike): Result;

  events: {
    "Created(uint256,address,bool)": EventFragment;
    "MainContractSet(address)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Created"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MainContractSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export type CreatedEvent = TypedEvent<
  [BigNumber, string, boolean] & {
    tokenId: BigNumber;
    contractAddress: string;
    passed: boolean;
  }
>;

export type MainContractSetEvent = TypedEvent<
  [string] & { newAddress: string }
>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string] & { previousOwner: string; newOwner: string }
>;

export class VerificationContractToken extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: VerificationContractTokenInterface;

  functions: {
    contractAddresses(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    contractTokenIds(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    contractTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string, string, boolean] & {
        tokenId: BigNumber;
        contractAddress: string;
        countries: string;
        passed: boolean;
      }
    >;

    create(
      contractAddress: string,
      countries: string,
      passed: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    list(overrides?: CallOverrides): Promise<[string]>;

    modify(
      contractAddress: string,
      passed: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    purge(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMainContractAddress(
      _mainContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    verify(
      target: string,
      overrides?: CallOverrides
    ): Promise<[boolean, string]>;
  };

  contractAddresses(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  contractTokenIds(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  contractTokens(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, string, string, boolean] & {
      tokenId: BigNumber;
      contractAddress: string;
      countries: string;
      passed: boolean;
    }
  >;

  create(
    contractAddress: string,
    countries: string,
    passed: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  list(overrides?: CallOverrides): Promise<string>;

  modify(
    contractAddress: string,
    passed: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  purge(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMainContractAddress(
    _mainContract: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  verify(target: string, overrides?: CallOverrides): Promise<[boolean, string]>;

  callStatic: {
    contractAddresses(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    contractTokenIds(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    contractTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string, string, boolean] & {
        tokenId: BigNumber;
        contractAddress: string;
        countries: string;
        passed: boolean;
      }
    >;

    create(
      contractAddress: string,
      countries: string,
      passed: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    list(overrides?: CallOverrides): Promise<string>;

    modify(
      contractAddress: string,
      passed: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    purge(overrides?: CallOverrides): Promise<boolean>;

    setMainContractAddress(
      _mainContract: string,
      overrides?: CallOverrides
    ): Promise<void>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    verify(
      target: string,
      overrides?: CallOverrides
    ): Promise<[boolean, string]>;
  };

  filters: {
    "Created(uint256,address,bool)"(
      tokenId?: null,
      contractAddress?: string | null,
      passed?: null
    ): TypedEventFilter<
      [BigNumber, string, boolean],
      { tokenId: BigNumber; contractAddress: string; passed: boolean }
    >;

    Created(
      tokenId?: null,
      contractAddress?: string | null,
      passed?: null
    ): TypedEventFilter<
      [BigNumber, string, boolean],
      { tokenId: BigNumber; contractAddress: string; passed: boolean }
    >;

    "MainContractSet(address)"(
      newAddress?: string | null
    ): TypedEventFilter<[string], { newAddress: string }>;

    MainContractSet(
      newAddress?: string | null
    ): TypedEventFilter<[string], { newAddress: string }>;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;
  };

  estimateGas: {
    contractAddresses(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    contractTokenIds(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    contractTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    create(
      contractAddress: string,
      countries: string,
      passed: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    list(overrides?: CallOverrides): Promise<BigNumber>;

    modify(
      contractAddress: string,
      passed: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    purge(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMainContractAddress(
      _mainContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    verify(target: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    contractAddresses(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    contractTokenIds(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    contractTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    create(
      contractAddress: string,
      countries: string,
      passed: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    list(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    modify(
      contractAddress: string,
      passed: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    purge(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMainContractAddress(
      _mainContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    verify(
      target: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
