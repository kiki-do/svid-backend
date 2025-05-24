-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "socials" TEXT[],
    "statisticsId" INTEGER,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statistics" (
    "id" SERIAL NOT NULL,
    "kills" INTEGER NOT NULL,
    "deaths" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "mapCount" INTEGER NOT NULL,
    "place" INTEGER NOT NULL,
    "win" INTEGER NOT NULL,
    "lose" INTEGER NOT NULL,
    "kd" DOUBLE PRECISION NOT NULL,
    "kda" DOUBLE PRECISION NOT NULL,
    "svidRating" DOUBLE PRECISION NOT NULL,
    "mvp" INTEGER NOT NULL,
    "maps" TEXT[],

    CONSTRAINT "Statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "kills" INTEGER NOT NULL,
    "deaths" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "mvp" INTEGER NOT NULL,
    "place" INTEGER NOT NULL,
    "map" TEXT NOT NULL,
    "playerId" INTEGER NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "win" BOOLEAN NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentStatistics" (
    "id" SERIAL NOT NULL,
    "kills" INTEGER NOT NULL,
    "deaths" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "mapCount" INTEGER NOT NULL,
    "place" INTEGER NOT NULL,
    "win" INTEGER NOT NULL,
    "lose" INTEGER NOT NULL,
    "kd" DOUBLE PRECISION NOT NULL,
    "kda" DOUBLE PRECISION NOT NULL,
    "svidRating" DOUBLE PRECISION NOT NULL,
    "mvp" INTEGER NOT NULL,
    "tournamentId" INTEGER NOT NULL,

    CONSTRAINT "TournamentStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchStatistics" (
    "id" SERIAL NOT NULL,
    "kills" INTEGER NOT NULL,
    "deaths" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "kd" DOUBLE PRECISION NOT NULL,
    "kda" DOUBLE PRECISION NOT NULL,
    "mvp" INTEGER NOT NULL,
    "win" BOOLEAN NOT NULL,
    "matchId" INTEGER NOT NULL,

    CONSTRAINT "MatchStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_login_key" ON "Admin"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Player_nickname_key" ON "Player"("nickname");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_statisticsId_fkey" FOREIGN KEY ("statisticsId") REFERENCES "Statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentStatistics" ADD CONSTRAINT "TournamentStatistics_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchStatistics" ADD CONSTRAINT "MatchStatistics_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
