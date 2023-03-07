const { network, deployments, ethers } = require("hardhat")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { networkConfig, developmentChains } = require("../../helper-hardhat-config")
const { numToBytes32 } = require("../../helper-functions")
const { assert, expect } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("ERC20 Standard Implementation Tests", async function () {
          //set log level to ignore non errors
          let ERC20
          let token
          let deployer
          ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.ERROR)

          // We define a fixture to reuse the same setup in every test.
          // We use loadFixture to run this setup once, snapshot that state,
          // and reset Hardhat Network to that snapshot in every test.
          /*async function deployERC20() {
              const [deployer] = await ethers.getSigners()
              //await deployments.fixture["all"]
              const token = await ethers.getContractFactory("ERC20Standard")
              const ERC20 = await token.connect(deployer).deploy("Token", "TKN")
              //const chainId = network.config.chainId
              //const Token = await Token.connect(deployer).deploy("Token", "TKN")
              //const ERC20 = await ethers.getContract("ERC20standard")

              return { ERC20 }
          }*/
          beforeEach(async () => {
              // const accounts = await ethers.getSigners()
              const [aDeployer] = await ethers.getSigners()
              deployer = aDeployer
              token = await ethers.getContractFactory("ERC20Standard")
              ERC20 = await token.connect(deployer).deploy("Token", "TKN")
          })

          describe("ERC20 Functionality", async function () {
              describe("Mint Security", async function () {
                  it("It should sucessfully show zero supply", async function () {
                      const supply = await ERC20.totalSupply()
                      assert.equal(supply.toString(), 0)
                  })
                  it("It should sucessfully mint 1000 coin by owner", async function () {
                      const response = await ERC20.mint(deployer.address, 1000)
                      const supply = await ERC20.totalSupply()
                      assert.equal(supply.toString(), 1000)
                  })

                  it("Should allow anyone to Mint", async function () {
                      const [account, account1] = await ethers.getSigners()
                      const aResponse = await ERC20.connect(account1).mint(account1.address, 1000)
                      const accountBal = await ERC20.balanceOf(account1.address)
                      assert.equal(accountBal.toString(), 1000)
                  })

                  it("Shouldent allow anyone to Mint on the internal function", async function () {
                      const [account, account1] = await ethers.getSigners()
                      await expect(
                          ERC20.connect(account1)._mint(account1.address, 1000)
                      ).to.be.revertedWithCustomError("ERC20.connect(...)._mint is not a function")
                  })
              })
          })
      })
