# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY GeekzKai.csproj ./  
RUN dotnet restore GeekzKai.csproj

# Copy all source code
COPY . .  

# Publish the project
RUN dotnet publish GeekzKai.csproj -c Release -o /app/publish

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "GeekzKai.dll"]
