const { network, ethers } = require("hardhat")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { networkConfig, developmentChains } = require("../../helper-hardhat-config")
const { numToBytes32 } = require("../../helper-functions")
const { assert, expect } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("ERC20 Standard Implementation Tests", async function () {
          //set log level to ignore non errors
          ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.ERROR)

          // We define a fixture to reuse the same setup in every test.
          // We use loadFixture to run this setup once, snapshot that state,
          // and reset Hardhat Network to that snapshot in every test.
          async function deployERC20() {
              const [deployer] = await ethers.getSigners()

              const chainId = network.config.chainId

              const Token = await ethers.getContractFactory("ERC20")
              const ERC20 = await Token.connect(deployer).deploy("Token", "TKN")

              return { ERC20 }
          }

          describe("ERC20 Functionality", async function () {
              describe("Mint Security", async function () {
                  it("It should sucessfully mint 1000 coin by owner", async function () {
                      const response = await ERC20._mint(deployer, 1000)
                      const supply = await ERC20.totalSupply()
                      assert.equal(supply.toString(), 1000)
                  })

                  it("Shouldent allow anyone to Mint", async function () {
                      const [account, account1] = await getSigners()
                      await ERC20.connect(account1)._mint(account1, 1000)
                      const accountBal = await ERC20.balanceOf(account1)
                      assert.equal(accountBal.toString, 0)
                  })
              })
          })
      })
