# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj first (better caching)
COPY GeekzKai/GeekzKai.csproj ./GeekzKai/
RUN dotnet restore GeekzKai/GeekzKai.csproj

# Copy all backend files
COPY . .

# Build & Publish
RUN dotnet publish GeekzKai/GeekzKai.csproj -c Release -o /app/publish


# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "GeekzKai.dll"]
